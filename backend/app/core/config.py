import os
from dotenv import load_dotenv

load_dotenv()

DB_URL           = os.getenv("DB_URL", "sqlite:///./modelguard.db")
MODEL_PATH       = os.getenv("MODEL_PATH", r"D:\ModelGuard AI\models\saved\model.pkl")
PREPROCESSOR_PATH= os.getenv("PREPROCESSOR_PATH", r"D:\ModelGuard AI\models\saved\preprocessor.pkl")
FEATURE_NAMES_PATH = os.getenv("FEATURE_NAMES_PATH", r"D:\ModelGuard AI\data\reference\feature_names.json")