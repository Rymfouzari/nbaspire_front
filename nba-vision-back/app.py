import boto3
import time
import joblib
import numpy as np
import pandas as pd
from chalice import Chalice, Response, BadRequestError, CORSConfig
import os
import logging
import traceback
from joblib import parallel_backend

logging.basicConfig(level=logging.DEBUG)

app = Chalice(app_name='nbaspire-back')

# Configuration CORS globale
cors_config = CORSConfig(
    allow_origin='*',
    allow_headers=['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
    max_age=600,
    expose_headers=['X-Special-Header'],
    allow_credentials=True
)

# Appliquer CORS à toutes les routes
app.api.cors = cors_config

ATHENA_DATABASE = 'nba_aspire_db'
ATHENA_TABLE = 'final_nba_dataset_cleaned'
ATHENA_OUTPUT = 's3://nbaaspire-bucket/athena-results/'
ATHENA_REGION = 'eu-west-1'

client = boto3.client('athena', region_name=ATHENA_REGION)

model = None

def load_ml_models():
    global model
    s3 = boto3.client("s3")
    bucket_name = "my-nba-models"
    model_key = "multi_output_lr.pkl"
    local_path = f"/tmp/{model_key}"
    
    try:
        print("📡 Téléchargement du modèle depuis S3...")
        s3.download_file(bucket_name, model_key, local_path)
        
        with parallel_backend('threading'):
            model = joblib.load(local_path)
        
        print(f"✅ Modèle chargé avec succès depuis S3. Type: {type(model)}")
        return True
    except Exception as e:
        print(f"❌ Erreur lors du chargement : {e}")
        traceback.print_exc()
        return False

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

def format_player(p):
    return {
        "player_id": str(int(float(p["player_id"]))),
        "name": p["player"],
        "team": p["tm"],
        "position": p["pos"],
        "points": p["pts_per_game"],
        "rebounds": p["trb_per_game"],
        "assists": p["ast_per_game"],
        "field_goal_percentage": p["fg_percent"] * 100,
        "three_point_percentage": p["x3p_percent"] * 100,
        "free_throw_percentage": p["ft_percent"] * 100,
        "efficiency": round(
            (p["pts_per_game"] + p["trb_per_game"] + p["ast_per_game"]) / p["mp_per_game"], 2
        ) if p["mp_per_game"] else 0
    }

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



@app.route('/health', methods=['GET'], cors=cors_config)
def health():
    print("🏥 Health check called")
    loaded = model is not None
    response = {
        'status': 'ok', 
        'model_loaded': loaded,
        'model_type': str(type(model)) if model else None
    }
    print(f"🏥 Health response: {response}")
    return response

@app.route('/predict', methods=['POST'], cors=cors_config)
def predict_player():
    print("🔮 Predict route called!")
    
    try:
        global model
        
        if model is None:
            print("❌ Model not loaded!")
            return Response(
                body={"error": "Model not loaded"}, 
                status_code=500,
                headers={
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            )
        
        data = app.current_request.json_body
        print(f"📥 Received data: {data}")
        
        # Validation des données requises
        required_fields = ['age', 'pos', 'experience']
        for field in required_fields:
            if field not in data:
                raise BadRequestError(f"Champ manquant: {field}")
        
        # Encodage manuel de la position
        pos_mapping = {'PG': 0, 'SG': 1, 'SF': 2, 'PF': 3, 'C': 4}
        position = data.get('pos')
        
        if position not in pos_mapping:
            raise BadRequestError(f"Position inconnue: {position}")
        
        pos_encoded = pos_mapping[position]
        print(f"🏀 Position {position} encodée en {pos_encoded}")
        
        # Construction des features dans l'ordre requis
        features = [
            data['age'],
            pos_encoded,
            data['experience'],
            data.get('height_wo_shoes', 0),
            data.get('height_w_shoes', 0),
            data.get('weight', 0),
            data.get('wingspan', 0),
            data.get('standing_reach', 0),
            data.get('body_fat_pct', 0),
            data.get('hand_length', 0),
            data.get('hand_width', 0)
        ]
        
        print(f"🔢 Features: {features}")
        
        features_array = np.array(features, dtype=np.float64).reshape(1, -1)
        print(f"📊 Features array shape: {features_array.shape}")
        
        prediction = model.predict(features_array)[0]
        print(f"🎯 Raw prediction: {prediction}")
        
        response = {
            "overall_score": round(float(prediction[0]), 2),
            "detailed_predictions": round(float(prediction[1]), 2),
            "strengths": round(float(prediction[2]), 2)
        }
        
        print(f"✅ Final response: {response}")
        return Response(
            body=response,
            status_code=200,
            headers={
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        )
        
    except Exception as e:
        print("=== ERROR IN PREDICT ROUTE ===")
        print(f"Error type: {type(e)}")
        print(f"Error message: {str(e)}")
        traceback.print_exc()
        return Response(
            body={"error": str(e)}, 
            status_code=400,
            headers={
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        )

@app.route('/players', methods=['GET'], cors=cors_config)
def get_players():
    print("Players route called")
    query = f"""
        SELECT 
            player,
            age,
            orb_percent,
            drb_percent,
            trb_percent,
            ast_percent,
            stl_percent,
            blk_percent,
            tov_percent,
            ts_percent
        FROM player_stats_merged_with_age
    """
    
    try:
        results = run_athena_query(query)
        headers = [col['VarCharValue'] for col in results['ResultSet']['Rows'][0]['Data']]
        players = [
            dict(zip(headers, [d.get('VarCharValue', '') for d in row['Data']]))
            for row in results['ResultSet']['Rows'][1:]
        ]
        print(f"✅ Found {len(players)} players")
        return {"data": players}
    except Exception as e:
        print(f"❌ Error in players route: {e}")
        return Response(body={"error": str(e)}, status_code=500)
    
@app.route('/players/comparison', methods=['GET'], cors=cors_config)
def get_players_for_comparison():
    print("Players comparison route called")
    query = f"""
        SELECT 
            player_id, player, pos, age, tm, pts_per_game,
            height_wo_shoes_ft_in, weight, wingspan_ft_in,
            mp_per_game, fg_percent, trb_per_game, ast_per_game
        FROM {ATHENA_TABLE}
    """
    
    try:
        results = run_athena_query(query)
        headers = [col['VarCharValue'] for col in results['ResultSet']['Rows'][0]['Data']]
        players = [
            dict(zip(headers, [d.get('VarCharValue', '') for d in row['Data']]))
            for row in results['ResultSet']['Rows'][1:]
        ]
        print(f"✅ Found {len(players)} players for comparison")
        return {"data": players}
    except Exception as e:
        print(f"❌ Error in /players/comparison: {e}")
        return Response(body={"error": str(e)}, status_code=500)


@app.route('/compare/{player1_id}/{player2_id}', cors=True)
def compare_players(player1_id, player2_id):
    try:
        # Nettoyage des IDs (en cas de .0, ex: 5113.0 -> 5113)
        clean_id1 = str(int(float(player1_id)))
        clean_id2 = str(int(float(player2_id)))

        query = f"""
            SELECT player_id, player, pos, tm, pts_per_game, ast_per_game, trb_per_game,
                fg_percent, x3p_percent, ft_percent, mp_per_game
            FROM (
                SELECT *, ROW_NUMBER() OVER (PARTITION BY player_id ORDER BY mp_per_game DESC) AS rn
                FROM {ATHENA_TABLE}
                WHERE CAST(player_id AS DOUBLE) IN ({float(player1_id)}, {float(player2_id)})
            ) sub
            WHERE rn = 1
        """

        print("REQUÊTE ATHENA :\n", query)

        results = run_athena_query(query)
        headers = [col['VarCharValue'] for col in results['ResultSet']['Rows'][0]['Data']]
        players = []
        for row in results['ResultSet']['Rows'][1:]:
            data = row['Data']
            player = dict(zip(
                headers,
                [float(d.get('VarCharValue', 0) or 0) if i not in [0, 1, 2, 3] else d.get('VarCharValue', '')
                 for i, d in enumerate(data)]
            ))
            players.append(player)

        if len(players) != 2:
            return Response(body={"error": "One or both players not found."}, status_code=404)

        player1 = next(p for p in players if str(int(float(p["player_id"]))) == str(int(float(player1_id))))
        player2 = next(p for p in players if str(int(float(p["player_id"]))) == str(int(float(player2_id))))


        score1 = compute_score(player1)
        score2 = compute_score(player2)
        diff = round(score1 - score2, 2)


        return {
            "player1": format_player(player1),
            "player2": format_player(player2),
            "global_score": {
                "player1_score": round(score1, 2),
                "player2_score": round(score2, 2)
            },
            "win_contribution_difference": diff
        }

    except Exception as e:
        print("=== ERROR IN /compare ===")
        traceback.print_exc()
        return Response(body={"error": str(e)}, status_code=500)


# Charger le modèle au démarrage
try:
    success = load_ml_models()
    if success:
        print("🚀 Application ready with model loaded!")
    else:
        print("⚠️ Application started but model failed to load")
except Exception as e:
    print(f"⚠️ Échec du chargement du modèle au démarrage : {e}")
