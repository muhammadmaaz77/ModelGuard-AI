import os
import sqlite3
import numpy as np
import pandas as pd
from datetime import datetime

REPO_ROOT   = r"D:\ModelGuard AI"
DB_PATH     = os.path.join(REPO_ROOT, "backend", "modelguard.db")

CONFIDENCE_LOW_THRESHOLD = 0.60
MIN_SAMPLES              = 10


def load_predictions():
    conn = sqlite3.connect(DB_PATH)
    df   = pd.read_sql(
        "SELECT prediction, confidence, timestamp FROM prediction_logs ORDER BY timestamp ASC",
        conn
    )
    conn.close()
    return df


def compute_metrics(df):
    total        = len(df)
    avg_conf     = round(float(df["confidence"].mean()), 4)
    low_conf     = int((df["confidence"] < CONFIDENCE_LOW_THRESHOLD).sum())
    churn_rate   = round(float(df["prediction"].mean()) * 100, 2)
    stays_count  = int((df["prediction"] == 0).sum())
    churns_count = int((df["prediction"] == 1).sum())
    conf_p25     = round(float(np.percentile(df["confidence"], 25)), 4)
    conf_p75     = round(float(np.percentile(df["confidence"], 75)), 4)
    conf_min     = round(float(df["confidence"].min()), 4)
    conf_max     = round(float(df["confidence"].max()), 4)
    return {
        "total_predictions"   : total,
        "avg_confidence"      : avg_conf,
        "conf_min"            : conf_min,
        "conf_max"            : conf_max,
        "conf_p25"            : conf_p25,
        "conf_p75"            : conf_p75,
        "low_confidence_count": low_conf,
        "churn_rate_pct"      : churn_rate,
        "stays_count"         : stays_count,
        "churns_count"        : churns_count,
    }


def compute_rolling(df):
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df.sort_values("timestamp")
    windows = {}
    for label, tail in [("last_10", 10), ("last_20", 20), ("all_time", len(df))]:
        chunk = df.tail(tail)
        windows[label] = {
            "avg_confidence" : round(float(chunk["confidence"].mean()), 4),
            "churn_rate_pct" : round(float(chunk["prediction"].mean()) * 100, 2),
            "count"          : len(chunk),
        }
    return windows


def check_health(metrics, rolling):
    flags = []
    if metrics["avg_confidence"] < CONFIDENCE_LOW_THRESHOLD:
        flags.append(f"LOW CONFIDENCE — avg {metrics['avg_confidence']} below {CONFIDENCE_LOW_THRESHOLD}")
    if metrics["low_confidence_count"] > metrics["total_predictions"] * 0.3:
        flags.append(f"HIGH LOW-CONFIDENCE RATE — {metrics['low_confidence_count']} predictions below threshold")
    last10_conf  = rolling["last_10"]["avg_confidence"]
    alltime_conf = rolling["all_time"]["avg_confidence"]
    if last10_conf < alltime_conf * 0.9:
        flags.append(f"CONFIDENCE DROPPING — last 10 avg ({last10_conf}) vs all-time ({alltime_conf})")
    return flags


def run_performance_tracking():
    print(f"\n{'─'*50}")
    print(f"  ModelGuard AI — Performance Tracker")
    print(f"  Run at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'─'*50}")

    df = load_predictions()

    if df.empty or len(df) < MIN_SAMPLES:
        print(f"  Not enough data yet.")
        print(f"  Need {MIN_SAMPLES} predictions — currently have {len(df)}.")
        return

    metrics = compute_metrics(df)
    rolling = compute_rolling(df)
    flags   = check_health(metrics, rolling)

    print(f"\n  Overall Metrics ({metrics['total_predictions']} predictions)")
    print(f"  {'─'*44}")
    print(f"  Avg confidence       : {metrics['avg_confidence']}")
    print(f"  Confidence range     : {metrics['conf_min']} → {metrics['conf_max']}")
    print(f"  Confidence p25/p75   : {metrics['conf_p25']} / {metrics['conf_p75']}")
    print(f"  Low confidence count : {metrics['low_confidence_count']}")
    print(f"  Stays  predictions   : {metrics['stays_count']}")
    print(f"  Churns predictions   : {metrics['churns_count']}")
    print(f"  Churn rate           : {metrics['churn_rate_pct']}%")

    print(f"\n  Rolling Windows")
    print(f"  {'─'*44}")
    print(f"  {'Window':<12} {'Avg Conf':>10} {'Churn Rate':>12} {'Count':>8}")
    print(f"  {'─'*12} {'─'*10} {'─'*12} {'─'*8}")
    for window, s in rolling.items():
        print(f"  {window:<12} {s['avg_confidence']:>10} {s['churn_rate_pct']:>11}% {s['count']:>8}")

    print(f"\n  Health Flags")
    print(f"  {'─'*44}")
    if flags:
        for flag in flags:
            print(f"  WARNING: {flag}")
    else:
        print(f"  All metrics look healthy.")

    print(f"\n{'─'*50}\n")

    # ─── FIRE ALERTS ──────────────────────────────────────────────────────────
    from alert_manager import alert_low_confidence, alert_confidence_dropping

    if metrics["avg_confidence"] < CONFIDENCE_LOW_THRESHOLD:
        alert_low_confidence(metrics["avg_confidence"], metrics["total_predictions"])

    last10_conf  = rolling["last_10"]["avg_confidence"]
    alltime_conf = rolling["all_time"]["avg_confidence"]
    if last10_conf < alltime_conf * 0.9:
        alert_confidence_dropping(last10_conf, alltime_conf)

    return {
        "metrics"    : metrics,
        "rolling"    : rolling,
        "flags"      : flags,
        "checked_at" : datetime.now().isoformat(),
    }


if __name__ == "__main__":
    run_performance_tracking()