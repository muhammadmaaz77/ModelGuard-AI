import json
import joblib
from app.core.config import MODEL_PATH, PREPROCESSOR_PATH, FEATURE_NAMES_PATH
from app.core.logger import logger

def load_model():
    logger.info(f"Loading model from {MODEL_PATH}")
    return joblib.load(MODEL_PATH)

def load_preprocessor():
    logger.info(f"Loading preprocessor from {PREPROCESSOR_PATH}")
    return joblib.load(PREPROCESSOR_PATH)

def load_feature_names():
    logger.info(f"Loading feature names from {FEATURE_NAMES_PATH}")
    with open(FEATURE_NAMES_PATH, "r") as f:
        return json.load(f)