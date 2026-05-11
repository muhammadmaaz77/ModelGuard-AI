import requests
from datetime import datetime

TELEGRAM_TOKEN = "8397386925:AAHvC3LEprmWt5-4puct0qjD-Ll7S9xhS88"
CHAT_ID        = "5958877845"
TELEGRAM_URL   = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"

CONFIDENCE_THRESHOLD = 0.60
PSI_THRESHOLD        = 0.20
KS_THRESHOLD         = 0.05


def send_alert(message: str):
    try:
        payload = {
            "chat_id"    : CHAT_ID,
            "text"       : message,
            "parse_mode" : "Markdown",
        }
        response = requests.post(TELEGRAM_URL, json=payload, timeout=10)
        if response.status_code == 200:
            print(f"✅ Alert sent to Telegram")
        else:
            print(f"❌ Failed to send alert: {response.text}")
    except Exception as e:
        print(f"❌ Telegram error: {e}")


def alert_drift_detected(drifted_features: list, drift_results: list):
    lines = [
        "🚨 *ModelGuard AI — DRIFT ALERT*",
        f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        f"*Drift detected in {len(drifted_features)} feature(s):*",
    ]
    for r in drift_results:
        if r["drifted"]:
            lines.append(
                f"  • `{r['feature']}` — "
                f"KS p={r['ks_pvalue']} | "
                f"PSI={r['psi']}"
            )
    lines += [
        "",
        "⚠️ Model inputs shifted from training distribution.",
        "Consider retraining the model.",
    ]
    send_alert("\n".join(lines))


def alert_low_confidence(avg_confidence: float, total: int):
    message = (
        f"⚠️ *ModelGuard AI — LOW CONFIDENCE ALERT*\n"
        f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        f"Avg confidence dropped to `{avg_confidence}`\n"
        f"Threshold: `{CONFIDENCE_THRESHOLD}`\n"
        f"Total predictions checked: `{total}`\n\n"
        f"Model may be struggling with current data."
    )
    send_alert(message)


def alert_confidence_dropping(last10: float, alltime: float):
    message = (
        f"📉 *ModelGuard AI — CONFIDENCE DROPPING*\n"
        f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        f"Last 10 avg confidence : `{last10}`\n"
        f"All-time avg confidence: `{alltime}`\n\n"
        f"Recent predictions are less confident than usual."
    )
    send_alert(message)


def alert_system_healthy(total_predictions: int, avg_confidence: float):
    message = (
        f"✅ *ModelGuard AI — System Healthy*\n"
        f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        f"Total predictions : `{total_predictions}`\n"
        f"Avg confidence    : `{avg_confidence}`\n\n"
        f"No drift detected. All metrics normal."
    )
    send_alert(message)


if __name__ == "__main__":
    print("Sending test alert to Telegram...")
    send_alert(
        "🤖 *ModelGuard AI — Bot Connected*\n\n"
        "✅ Alert system is working.\n"
        "You will receive drift and performance alerts here."
    )