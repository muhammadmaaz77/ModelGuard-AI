import time
from drift_detection import run_drift_detection

# How often to run drift check (in seconds)
CHECK_INTERVAL = 60   # every 60 seconds

print("ModelGuard AI — Drift Scheduler started")
print(f"Checking for drift every {CHECK_INTERVAL} seconds...")
print("Press CTRL+C to stop\n")

while True:
    try:
        run_drift_detection()
        time.sleep(CHECK_INTERVAL)
    except KeyboardInterrupt:
        print("\nScheduler stopped.")
        break
    except Exception as e:
        print(f"Error during drift check: {e}")
        time.sleep(CHECK_INTERVAL)