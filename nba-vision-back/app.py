import boto3
import time
from chalice import Chalice, Response


app = Chalice(app_name='nbaspire-back')

ATHENA_DATABASE = 'nba_aspire_db'
ATHENA_TABLE = 'data'  # à adapter si différent
ATHENA_OUTPUT = 's3://nbaaspire-bucket/athena-results/'  # à adapter si nécessaire
ATHENA_REGION = 'eu-west-1'

def compute_score(player_row):
    weights = {
        'pts_per_game': 0.3,
        'ast_per_game': 0.2,
        'trb_per_game': 0.2,
        'fg_percent': 0.1,
        'x3p_percent': 0.1,
        'ft_percent': 0.1,
    }
    score = sum(player_row[stat] * w for stat, w in weights.items() if not pd.isna(player_row[stat]))
    return score

@app.middleware('http')
def add_cors_headers(event, get_response):
    response = get_response(event)
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


client = boto3.client('athena', region_name=ATHENA_REGION)

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

@app.route('/players')
def get_players():
    query = f"""
        SELECT 
            player_id,
            player,
            pos,
            age,
            tm,
            pts_per_game,
            height_wo_shoes_ft_in,
            weight,
            wingspan_ft_in,
            mp_per_game,
            fg_percent,
            trb_per_game,
            ast_per_game
        FROM {ATHENA_TABLE}
        WHERE season_year >= 2023
        LIMIT 50
    """
    try:
        results = run_athena_query(query)
        headers = [col['VarCharValue'] for col in results['ResultSet']['Rows'][0]['Data']]
        players = []
        for row in results['ResultSet']['Rows'][1:]:
            data = row['Data']
            player = dict(zip(headers, [d.get('VarCharValue', '') for d in data]))
            players.append(player)
        return {"data": players}
    except Exception as e:
        return Response(body={"error": str(e)}, status_code=500)


@app.route('/players/{player_id}')
def get_player_details(player_id):
    query = f"""
        SELECT * FROM data
        WHERE player_id = {player_id}
        LIMIT 1
    """
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
            player = dict(zip(headers, [float(d.get('VarCharValue', 0) or 0) if i != 1 else d.get('VarCharValue', '') for i, d in enumerate(data)]))
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
