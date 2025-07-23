import boto3
import time
import joblib
import numpy as np
import pandas as pd
from chalice import Chalice, Response, BadRequestError
import os
import logging
import traceback

from chalicelib.ensure_scipy import ensure_scipy
ensure_scipy()

logging.basicConfig(level=logging.DEBUG)

print("Current working directory:", os.getcwd())
print("Files in current dir:", os.listdir())

app = Chalice(app_name='nbaspire-back')

ATHENA_DATABASE = 'nba_aspire_db'
ATHENA_TABLE = 'data'
ATHENA_OUTPUT = 's3://nbaaspire-bucket/athena-results/'
ATHENA_REGION = 'eu-west-1'

client = boto3.client('athena', region_name=ATHENA_REGION)

@app.middleware('http')
def add_cors_headers(event, get_response):
    response = get_response(event)
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET,OPTIONS,POST'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

model = None
scaler = None
label_encoder = None

def compute_score(player_row):
    weights = {
        'pts_per_game': 0.3,
        'ast_per_game': 0.2,
        'trb_per_game': 0.2,
        'fg_percent': 0.1,
        'x3p_percent': 0.1,
        'ft_percent': 0.1,
    }
    return sum(player_row.get(stat, 0) * w for stat, w in weights.items())


def load_ml_models():
    global model, scaler, label_encoder
    base_path = os.getcwd()
    print("Loading ML models...")
    print("Base directory:", base_path)

    try:
        model_path = os.path.join(base_path, 'multi_output_debutants_xgboost_model.pkl')
        scaler_path = os.path.join(base_path, 'scaler_deb_xgb.pkl')
        label_encoder_path = os.path.join(base_path, 'label_encoder_deb_xbg.pkl')

        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        label_encoder = joblib.load(label_encoder_path)

        print("=== ALL ML MODELS LOADED SUCCESSFULLY ===")

    except Exception as e:
        print("=== ERROR LOADING ML MODELS ===")
        traceback.print_exc()
        print("=== END OF TRACEBACK ===")
        raise e

def run_athena_query(query: str):
    response = client.start_query_execution(
        QueryString=query,
        QueryExecutionContext={'Database': ATHENA_DATABASE},
        ResultConfiguration={'OutputLocation': ATHENA_OUTPUT}
    )
    query_id = response['QueryExecutionId']

    while True:
        result = client.get_query_execution(QueryExecutionId=query_id)
        state = result['QueryExecution']['Status']['State']
        if state in ['SUCCEEDED', 'FAILED', 'CANCELLED']:
            break
        time.sleep(0.5)

    if state != 'SUCCEEDED':
        raise Exception(f"Athena query failed with state: {state}")

    result = client.get_query_results(QueryExecutionId=query_id)
    return result

@app.route('/predict', methods=['POST'])
def predict_player():
    try:
        print("Predict route triggered")
        global model, scaler, label_encoder

        if model is None or scaler is None or label_encoder is None:
            load_ml_models()

        data = app.current_request.json_body
        print("Received data:", data)

        position = data.get('position')
        if position not in label_encoder['pos'].classes_:
            raise BadRequestError(f"Position inconnue: {position}")

        pos_encoded = label_encoder['pos'].transform([position])[0]

        features = [
            data['age'], data['experience'], data['heightWithoutShoes'],
            data['heightWithShoes'], data['weight'], data['wingspan'],
            data['verticalReach'], data['bodyFatPercentage'],
            data['handLength'], data['handWidth'], pos_encoded
        ]

        features_array = np.array(features).reshape(1, -1)
        scaled_features = scaler.transform(features_array)
        prediction = model.predict(scaled_features)[0]

        response = {
            "mvpProbability": float(prediction[0]),
            "allStarProbability": float(prediction[1]),
            "playoffSuccess": float(prediction[2]),
            "nextSeasonPoints": float(prediction[3]),
            "confidence": 90.0,
            "factors": [
                {"name": "Attributs physiques", "impact": 85, "positive": True},
                {"name": "Expérience", "impact": 72, "positive": True},
                {"name": "Poste adapté", "impact": 68, "positive": False},
                {"name": "Potentiel athlétique", "impact": 91, "positive": True},
            ]
        }
        return response

    except Exception as e:
        print("=== ERROR IN PREDICT ROUTE ===")
        traceback.print_exc()
        return Response(body={"error": str(e)}, status_code=400)

@app.route('/players')
def get_players():
    query = f"""
        SELECT 
            player_id, player, pos, age, tm, pts_per_game,
            height_wo_shoes_ft_in, weight, wingspan_ft_in,
            mp_per_game, fg_percent, trb_per_game, ast_per_game
        FROM {ATHENA_TABLE}
        WHERE season_year >= 2023
        LIMIT 50
    """
    try:
        results = run_athena_query(query)
        headers = [col['VarCharValue'] for col in results['ResultSet']['Rows'][0]['Data']]
        players = [
            dict(zip(headers, [d.get('VarCharValue', '') for d in row['Data']]))
            for row in results['ResultSet']['Rows'][1:]
        ]
        return {"data": players}
    except Exception as e:
        return Response(body={"error": str(e)}, status_code=500)

@app.route('/players/{player_id}')
def get_player_details(player_id):
    query = f"SELECT * FROM data WHERE player_id = {player_id} LIMIT 1"
    try:
        results = run_athena_query(query)
        headers = [col['VarCharValue'] for col in results['ResultSet']['Rows'][0]['Data']]
        data = results['ResultSet']['Rows'][1]['Data']
        player = dict(zip(headers, [d.get('VarCharValue', '') for d in data]))
        return {"player": player}
    except Exception as e:
        return Response(body={"error": str(e)}, status_code=500)

@app.route('/compare/{player1_id}/{player2_id}')
def compare_players(player1_id, player2_id):
    query = f"""
        SELECT player_id, player, pts_per_game, ast_per_game, trb_per_game,
               fg_percent, mp_per_game, stl_per_game, blk_per_game, tov_per_game
        FROM {ATHENA_TABLE}
        WHERE player_id IN ({player1_id}, {player2_id})
    """
    try:
        results = run_athena_query(query)
        headers = [col['VarCharValue'] for col in results['ResultSet']['Rows'][0]['Data']]
        players = []
        for row in results['ResultSet']['Rows'][1:]:
            data = row['Data']
            player = dict(zip(
                headers,
                [float(d.get('VarCharValue', 0) or 0) if i != 1 else d.get('VarCharValue', '')
                 for i, d in enumerate(data)]
            ))
            players.append(player)

        if len(players) != 2:
            return Response(body={"error": "One or both players not found."}, status_code=404)

        player1 = next(p for p in players if str(int(p['player_id'])) == player1_id)
        player2 = next(p for p in players if str(int(p['player_id'])) == player2_id)

        score1 = compute_score(player1)
        score2 = compute_score(player2)

        return {
            "player1": {"name": player1['player'], "score": round(score1, 2), "details": player1},
            "player2": {"name": player2['player'], "score": round(score2, 2), "details": player2},
            "difference": round(score1 - score2, 2)
        }

    except Exception as e:
        return Response(body={"error": str(e)}, status_code=500)

@app.route('/health')
def health():
    loaded = model is not None and scaler is not None and label_encoder is not None
    return {'status': 'ok', 'model_loaded': loaded}
