# ModelGuard AI

ModelGuard AI is a real-time observability and monitoring platform for machine learning models. It tracks model performance, detects data drift, and provides a centralized dashboard for analyzing prediction logs and system health.

## Features

- **Real-Time Monitoring**: Track prediction volume, average confidence, and satisfaction rates via an intuitive dashboard.
- **Data Drift Detection**: Automated statistical tests (PSI, K-S tests) to catch when incoming live data deviates from the training baseline.
- **Model Registry & Uploads**: Upload new model weights (`.pkl`), preprocessors, and reference datasets directly through the UI without restarting the server.
- **Warm Dark UI**: A modern, high-contrast user interface built with custom CSS, designed specifically for data scientists and MLOps engineers.
- **Database Integration**: Seamlessly connects to PostgreSQL (via Supabase) using SQLAlchemy to persist logs, alerts, and metrics.

## Tech Stack

- **Frontend**: React, Vite, Recharts, Lucide Icons
- **Backend**: Python, FastAPI, Uvicorn, SQLAlchemy
- **Database**: PostgreSQL (Supabase)
- **Machine Learning**: Scikit-learn, Pandas, SciPy (for drift detection algorithms)

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.9+)
- A Supabase account (or local PostgreSQL instance)

### 1. Database Setup
1. Create a free project on [Supabase](https://supabase.com).
2. Grab your connection string from the database settings.

### 2. Backend Setup
Navigate to the `backend` directory and set up your Python environment:

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
pip install psycopg2-binary python-dotenv
```

Create a `.env` file in the `backend` directory with your database URL:
```ini
# Make sure to use postgresql+psycopg2:// instead of just postgresql://
DB_URL="postgresql+psycopg2://postgres.YOUR_ID:YOUR_PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres"
```

Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```

### 3. Frontend Setup
Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser to access the dashboard.

## Architecture Notes

- The backend exposes a `/predict` endpoint that handles incoming inference requests, calculates confidence scores, logs the payload to the database, and checks for potential drift.
- The `monitoring/` module runs asynchronous or scheduled jobs to compare the live data distribution against the reference dataset using Kolmogorov-Smirnov tests.
- The frontend charts are completely dynamic, fetching real-time aggregations from the FastAPI endpoints.

## License
MIT
