import os
import shutil
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.core.logger import logger
from app.services.model_loader import load_model, load_preprocessor, load_feature_names
from app.api.predict import predict_route

Base.metadata.create_all(bind=engine)

REPO_ROOT          = r"D:\ModelGuard AI"
MODELS_SAVED_DIR   = os.path.join(REPO_ROOT, "models", "saved")
DATA_REFERENCE_DIR = os.path.join(REPO_ROOT, "data", "reference")

state = {
    "model"        : None,
    "preprocessor" : None,
    "feature_names": None,
    "loaded"       : False,
    "model_name"   : "Unknown Model",
}

def try_load():
    import json
    try:
        state["model"]         = load_model()
        state["preprocessor"]  = load_preprocessor()
        state["feature_names"] = load_feature_names()
        
        metadata_path = os.path.join(DATA_REFERENCE_DIR, "model_metadata.json")
        if os.path.exists(metadata_path):
            with open(metadata_path) as f:
                meta = json.load(f)
                state["model_name"] = meta.get("model_name", "Unknown Model")
        else:
            state["model_name"] = "Unknown Model"
            
        state["loaded"]        = True
        logger.info("Model loaded successfully")
    except Exception as e:
        logger.warning(f"Could not load model on startup: {e}")
        state["loaded"] = False

try_load()

logger.info("ModelGuard AI backend starting...")

app = FastAPI(title="ModelGuard AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name"     : "ModelGuard AI",
        "status"   : "running",
        "version"  : "1.0.0",
        "endpoints": ["/predict", "/metrics", "/drift-summary", "/logs", "/health", "/model-info", "/status"],
    }


@app.get("/health")
def health():
    return {
        "status"      : "ok",
        "model_loaded": state["loaded"],
        "model_name": state.get("model_name", "No model loaded"),
    }


@app.get("/metrics")
def metrics():
    from app.core.database import SessionLocal
    from app.models.prediction_log import PredictionLog
    db   = SessionLocal()
    logs = db.query(PredictionLog).all()
    db.close()
    if not logs:
        return {"total": 0, "avg_confidence": 0, "class_1_rate": 0}
    total      = len(logs)
    avg_conf   = round(sum(l.confidence for l in logs) / total, 4)
    class_1_rate = round(sum(1 for l in logs if l.prediction == 1) / total * 100, 2)
    return {
        "total"          : total,
        "avg_confidence" : avg_conf,
        "class_1_rate"     : class_1_rate,
    }


@app.get("/logs")
def get_logs():
    from app.core.database import SessionLocal
    from app.models.prediction_log import PredictionLog
    db   = SessionLocal()
    rows = db.query(PredictionLog).order_by(
        PredictionLog.timestamp.desc()
    ).limit(50).all()
    db.close()
    return [
        {
            "id"        : r.id,
            "prediction": r.prediction_label,
            "confidence": round(r.confidence, 4),
            "timestamp" : str(r.timestamp),
        }
        for r in rows
    ]


@app.post("/upload")
async def upload_files(
    model_file       : UploadFile = File(...),
    preprocessor_file: UploadFile = File(...),
    reference_csv    : UploadFile = File(...),
    feature_names    : UploadFile = File(...),
):
    import json
    import csv
    from fastapi import HTTPException

    # 1. Read Feature Names
    features_content = await feature_names.read()
    try:
        expected_features = json.loads(features_content)
        if not isinstance(expected_features, list):
            raise ValueError()
    except Exception:
        raise HTTPException(status_code=400, detail="Upload failed: feature_names must be a valid JSON list of strings.")

    # 2. Read CSV Header
    csv_header_line = await reference_csv.read(8192)
    try:
        csv_header_str = csv_header_line.decode('utf-8')
        csv_reader = csv.reader(csv_header_str.splitlines())
        csv_headers = next(csv_reader)
    except Exception:
        raise HTTPException(status_code=400, detail="Upload failed: The reference dataset must be a valid CSV file.")

    # 3. Feature Completeness Validation
    missing_features = [f for f in expected_features if f not in csv_headers]
    if missing_features:
        raise HTTPException(
            status_code=400,
            detail=f"Upload failed: Reference CSV schema does not match feature names. Missing columns: {missing_features}. Please ensure you are uploading the processed (encoded) training dataset."
        )

    # Reset file pointers for saving
    await feature_names.seek(0)
    await reference_csv.seek(0)

    os.makedirs(MODELS_SAVED_DIR,   exist_ok=True)
    os.makedirs(DATA_REFERENCE_DIR, exist_ok=True)

    # Save each file to correct location
    files = {
        os.path.join(MODELS_SAVED_DIR,   "model.pkl")              : model_file,
        os.path.join(MODELS_SAVED_DIR,   "preprocessor.pkl")       : preprocessor_file,
        os.path.join(DATA_REFERENCE_DIR, "X_train_reference.csv")  : reference_csv,
        os.path.join(DATA_REFERENCE_DIR, "feature_names.json")     : feature_names,
    }

    for path, upload in files.items():
        with open(path, "wb") as f:
            shutil.copyfileobj(upload.file, f)

    # Reload model with new files
    try_load()

    if state["loaded"]:
        return {
            "success" : True,
            "message" : "Model uploaded and loaded successfully",
            "features": state["feature_names"],
        }
    else:
        return {
            "success": False,
            "message": "Files saved but model failed to load. Check file formats.",
        }


@app.get("/model-info")
def model_info():
    import json
    metadata_path = os.path.join(DATA_REFERENCE_DIR, "model_metadata.json")
    if os.path.exists(metadata_path):
        with open(metadata_path) as f:
            return json.load(f)
    return {"loaded": state["loaded"], "features": state["feature_names"]}

@app.post("/demo")
def load_demo():
    try_load()
    if state["loaded"]:
        return {"success": True, "message": "Demo model loaded successfully", "features": state["feature_names"]}
    return {"success": False, "message": "No model files found. Please upload your files first."}

@app.get("/status")
def status():
    from app.core.database import SessionLocal
    from app.models.prediction_log import PredictionLog
    db    = SessionLocal()
    total = db.query(PredictionLog).count()
    db.close()
    return {
        "model_loaded" : state["loaded"],
        "model_name"   : state.get("model_name", "None"),
        "total_predictions": total,
        "api_version"  : "1.0.0",
    }

from app.api.predict import router
app.include_router(router)


@app.get("/drift-summary")
def drift_summary():
    import sys
    monitoring_dir = os.path.join(REPO_ROOT, "monitoring")
    if monitoring_dir not in sys.path:
        sys.path.insert(0, monitoring_dir)

    # Realistic mock returned whenever real data is unavailable
    MOCK_DRIFT = {
        "status"          : "mock",
        "drift_detected"  : False,
        "drifted_features": ["MonthlyCharges"],
        "total_features"  : 6,
        "checked_at"      : None,
        "features": [
            {"name": "tenure",          "psi": 0.12, "ks_pvalue": 0.31, "status": "stable"},
            {"name": "MonthlyCharges",  "psi": 0.25, "ks_pvalue": 0.03, "status": "drift"},
            {"name": "TotalCharges",    "psi": 0.09, "ks_pvalue": 0.58, "status": "stable"},
            {"name": "SeniorCitizen",   "psi": 0.04, "ks_pvalue": 0.72, "status": "stable"},
            {"name": "Contract",        "psi": 0.17, "ks_pvalue": 0.12, "status": "stable"},
            {"name": "PaymentMethod",   "psi": 0.11, "ks_pvalue": 0.44, "status": "stable"},
        ],
        "message": "Showing demo data — need 50+ predictions for live analysis.",
    }

    try:
        from drift_detection import run_drift_detection, load_live_data, MIN_SAMPLES

        # Check data volume before running full detection
        live_df = load_live_data()
        if live_df.empty or len(live_df) < MIN_SAMPLES:
            logger.info(f"/drift-summary: {len(live_df)} samples < {MIN_SAMPLES} — returning mock")
            return {**MOCK_DRIFT, "live_sample_count": len(live_df)}

        result = run_drift_detection()
        if result is None:
            return MOCK_DRIFT

        # ── Real result — shape it to include per-feature status ──
        features = [
            {
                "name"     : r["feature"],
                "psi"      : r["psi"],
                "ks_pvalue": r["ks_pvalue"],
                "status"   : "drift" if r["drifted"] else "stable",
            }
            for r in result["results"]
        ]
        return {
            "status"          : "ok",
            "drift_detected"  : result["drift_detected"],
            "drifted_features": result["drifted_features"],
            "total_features"  : result["total_features"],
            "checked_at"      : result["checked_at"],
            "features"        : features,
        }

    except Exception as e:
        logger.warning(f"/drift-summary failed: {e}")
        return MOCK_DRIFT