import joblib

print("Loading model...")
model = joblib.load('multi_output_debutants_xgboost_model.pkl')
print("Model loaded.")

print("Loading scaler...")
scaler = joblib.load('scaler_deb_xgb.pkl')
print("Scaler loaded.")

print("Loading label encoder...")
label_encoder = joblib.load('label_encoder_deb_xbg.pkl')
print("Label encoder loaded.")
