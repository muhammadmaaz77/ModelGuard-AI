import os
import json
import pandas as pd
from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.logger import logger
from app.models.prediction_log import PredictionLog

router = APIRouter()


@router.post("/predict")
def predict(input_data: dict = Body(...), db: Session = Depends(get_db)):
    from app.main import state

    if not state["loaded"]:
        return {"error": "No model loaded. Please upload your model files first."}

    model        = state["model"]
    preprocessor = state["preprocessor"]

    # -----------------------------
    # Load metadata (for labels + raw features)
    # -----------------------------
    metadata_path = os.path.join(r"D:\ModelGuard AI\data\reference", "model_metadata.json")

    if os.path.exists(metadata_path):
        with open(metadata_path) as f:
            meta = json.load(f)
        labels = meta.get("class_labels", ["Class 0", "Class 1"])
        raw_features = meta.get("input_features", [])
    else:
        labels = ["Class 0", "Class 1"]
        raw_features = []

    # -----------------------------
    # Load trained column names (post-encoding order)
    # -----------------------------
    feature_names_path = os.path.join(r"D:\ModelGuard AI\data\reference", "feature_names.json")
    if os.path.exists(feature_names_path):
        with open(feature_names_path) as f:
            trained_columns = json.load(f)
    elif raw_features:
        trained_columns = raw_features
    else:
        trained_columns = list(input_data.keys())

    FALLBACK = {"prediction": 0, "label": "Fallback", "confidence": 0.5}

    try:
        # -----------------------------
        # Dual-mode input handling:
        #   Mode A — encoded key present directly: "Contract_One year": 1  → use as-is
        #   Mode B — raw value present:            "Contract": "One year"  → convert
        #   Mode C — nothing matched               → default 0
        # -----------------------------
        encoded = {}
        filled_features = []

        for col in trained_columns:
            # ── Mode A: caller already sent the encoded column name ──
            if col in input_data:
                try:
                    encoded[col] = float(input_data[col])
                except (TypeError, ValueError):
                    encoded[col] = 0
                    filled_features.append(col)

            elif "_" in col:
                # ── Mode B: try raw categorical conversion ──
                parts      = col.split("_", 1)   # split on first underscore only
                field, val = parts[0], parts[1]
                if field in input_data:
                    try:
                        encoded[col] = 1 if str(input_data[field]) == val else 0
                    except Exception:
                        encoded[col] = 0
                        filled_features.append(col)
                else:
                    # ── Mode C: nothing matched ──
                    encoded[col] = 0
                    filled_features.append(col)

            else:
                # ── Numeric column, no raw equivalent found ──
                encoded[col] = 0
                filled_features.append(col)

        # -----------------------------
        # Build DataFrame aligned to trained column order
        # -----------------------------
        df = pd.DataFrame([encoded])[trained_columns]

        # -----------------------------
        # Apply preprocessor (scaling only — encoding done above)
        # -----------------------------
        try:
            scaled = preprocessor.transform(df)
        except Exception as e:
            logger.warning(f"Preprocessor failed, using fallback: {e}")
            return {**FALLBACK, "filled_defaults": filled_features}

        # -----------------------------
        # Model prediction
        # -----------------------------
        prediction = int(model.predict(scaled)[0])
        confidence = float(model.predict_proba(scaled)[0][prediction])
        label      = labels[prediction] if prediction < len(labels) else f"Class {prediction}"

        # -----------------------------
        # Logging
        # -----------------------------
        try:
            log = PredictionLog(
                input_features   = json.dumps(input_data),
                prediction       = prediction,
                prediction_label = label,
                confidence       = confidence,
            )
            db.add(log)
            db.commit()
        except Exception as db_err:
            logger.warning(f"DB log failed (non-fatal): {db_err}")

        logger.info(f"Prediction: {label} | Confidence: {confidence:.4f}")

        # -----------------------------
        # Response
        # -----------------------------
        return {
            "prediction"     : prediction,
            "label"          : label,
            "confidence"     : round(confidence, 4),
            "filled_defaults": filled_features,
        }

    except Exception as e:
        logger.error(f"/predict unhandled exception — returning fallback: {e}")
        return FALLBACK


def predict_route(model, preprocessor, feature_names):
    return router