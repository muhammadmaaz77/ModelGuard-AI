import os
import json
import sqlite3
import numpy as np
import pandas as pd
from scipy import stats
from datetime import datetime

REPO_ROOT          = r"D:\ModelGuard AI"
DATA_REFERENCE_DIR = os.path.join(REPO_ROOT, "data", "reference")
DB_PATH            = os.path.join(REPO_ROOT, "backend", "modelguard.db")
REFERENCE_CSV      = os.path.join(DATA_REFERENCE_DIR, "X_train_reference.csv")
FEATURE_NAMES_PATH = os.path.join(DATA_REFERENCE_DIR, "feature_names.json")

KS_DRIFT_THRESHOLD  = 0.05
PSI_DRIFT_THRESHOLD = 0.2
MIN_SAMPLES         = 50


def load_reference_data():
    df = pd.read_csv(REFERENCE_CSV)
    with open(FEATURE_NAMES_PATH, "r") as f:
        feature_names = json.load(f)
    return df[feature_names].astype(float)


def load_live_data():
    conn = sqlite3.connect(DB_PATH)
    df   = pd.read_sql("SELECT input_features FROM prediction_logs", conn)
    conn.close()

    if df.empty:
        return pd.DataFrame()

    records = []
    for row in df["input_features"]:
        parsed = json.loads(row)
        flat = {}
        for k, v in parsed.items():
            if isinstance(v, dict):
                flat[k] = list(v.values())[0] if v else 0
            else:
                flat[k] = v
        records.append(flat)

    result = pd.DataFrame(records)

    for col in result.columns:
        try:
            result[col] = pd.to_numeric(result[col], errors="coerce")
        except Exception:
            pass

    return result.select_dtypes(include=["number"])


def compute_psi(reference_col, live_col, buckets=10):
    breakpoints = np.linspace(
        min(reference_col.min(), live_col.min()),
        max(reference_col.max(), live_col.max()),
        buckets + 1
    )
    ref_counts,  _ = np.histogram(reference_col, bins=breakpoints)
    live_counts, _ = np.histogram(live_col,      bins=breakpoints)
    ref_pct  = (ref_counts  + 1e-6) / len(reference_col)
    live_pct = (live_counts + 1e-6) / len(live_col)
    psi = np.sum((live_pct - ref_pct) * np.log(live_pct / ref_pct))
    return float(psi)


def run_drift_detection():
    print(f"\n{'─'*50}")
    print(f"  ModelGuard AI — Drift Detection")
    print(f"  Run at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'─'*50}")

    reference_df = load_reference_data()
    live_df      = load_live_data()

    if live_df.empty or len(live_df) < MIN_SAMPLES:
        print(f"  Not enough live data yet.")
        print(f"  Need {MIN_SAMPLES} predictions — currently have {len(live_df)}.")
        return

    print(f"  Reference samples : {len(reference_df)}")
    print(f"  Live samples      : {len(live_df)}\n")

    common_features  = [c for c in reference_df.columns if c in live_df.columns]
    drift_results    = []
    drifted_features = []

    for feature in common_features:
        ref_col  = reference_df[feature].dropna().values
        live_col = live_df[feature].dropna().values
        if len(live_col) == 0:
            continue

        ks_stat, ks_pvalue = stats.ks_2samp(ref_col, live_col)
        psi       = compute_psi(ref_col, live_col)
        ks_drift  = ks_pvalue < KS_DRIFT_THRESHOLD
        psi_drift = psi > PSI_DRIFT_THRESHOLD
        drifted   = ks_drift or psi_drift

        result = {
            "feature"   : feature,
            "ks_stat"   : round(ks_stat, 4),
            "ks_pvalue" : round(ks_pvalue, 4),
            "psi"       : round(psi, 4),
            "ks_drift"  : ks_drift,
            "psi_drift" : psi_drift,
            "drifted"   : drifted,
        }
        drift_results.append(result)
        if drifted:
            drifted_features.append(feature)

    print(f"  {'Feature':<35} {'KS p-val':>10} {'PSI':>8} {'Drift?':>8}")
    print(f"  {'─'*35} {'─'*10} {'─'*8} {'─'*8}")
    for r in drift_results:
        flag = "DRIFT" if r["drifted"] else "ok"
        print(f"  {r['feature']:<35} {r['ks_pvalue']:>10.4f} {r['psi']:>8.4f} {flag:>8}")

    print(f"\n{'─'*50}")
    if drifted_features:
        print(f"  DRIFT DETECTED in {len(drifted_features)} feature(s):")
        for f in drifted_features:
            print(f"    - {f}")
    else:
        print(f"  No drift detected. Model inputs look stable.")
    print(f"{'─'*50}\n")

    # ─── FIRE ALERTS ──────────────────────────────────────────────────────────
    from alert_manager import alert_drift_detected, alert_system_healthy
    if drifted_features:
        alert_drift_detected(drifted_features, drift_results)
    else:
        alert_system_healthy(len(live_df), 0.0)

    return {
        "total_features"   : len(drift_results),
        "drifted_features" : drifted_features,
        "drift_detected"   : len(drifted_features) > 0,
        "results"          : drift_results,
        "checked_at"       : datetime.now().isoformat(),
    }


if __name__ == "__main__":
    run_drift_detection()