# Graph Report - .  (2026-04-25)

## Corpus Check
- Corpus is ~19,949 words - fits in a single context window. You may not need a graph.

## Summary
- 142 nodes · 164 edges · 28 communities detected
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_API Server & Model Loader|API Server & Model Loader]]
- [[_COMMUNITY_Frontend API Client|Frontend API Client]]
- [[_COMMUNITY_Prediction Pipeline|Prediction Pipeline]]
- [[_COMMUNITY_Analysis Page UI|Analysis Page UI]]
- [[_COMMUNITY_Alert Management|Alert Management]]
- [[_COMMUNITY_Performance Tracker|Performance Tracker]]
- [[_COMMUNITY_Dashboard UI|Dashboard UI]]
- [[_COMMUNITY_Logs Page UI|Logs Page UI]]
- [[_COMMUNITY_Drift Detection|Drift Detection]]
- [[_COMMUNITY_Settings Page|Settings Page]]
- [[_COMMUNITY_Upload Page|Upload Page]]
- [[_COMMUNITY_MLData Stack|ML/Data Stack]]
- [[_COMMUNITY_Support Page|Support Page]]
- [[_COMMUNITY_Frontend Assets & Entry|Frontend Assets & Entry]]
- [[_COMMUNITY_Health API|Health API]]
- [[_COMMUNITY_Monitoring Scheduler|Monitoring Scheduler]]
- [[_COMMUNITY_Core Config & DB|Core Config & DB]]
- [[_COMMUNITY_Sidebar Navigation|Sidebar Navigation]]
- [[_COMMUNITY_Metric Cards|Metric Cards]]
- [[_COMMUNITY_Prediction Logs DB|Prediction Logs DB]]
- [[_COMMUNITY_Drift Log Model|Drift Log Model]]
- [[_COMMUNITY_Logger Utility|Logger Utility]]
- [[_COMMUNITY_Helpers Utility|Helpers Utility]]
- [[_COMMUNITY_React Vite Setup|React Vite Setup]]
- [[_COMMUNITY_Navbar Component|Navbar Component]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]

## God Nodes (most connected - your core abstractions)
1. `run_performance_tracking()` - 8 edges
2. `try_load()` - 7 edges
3. `run_drift_detection()` - 7 edges
4. `send_alert()` - 6 edges
5. `PredictionLog` - 4 edges
6. `alert_drift_detected()` - 4 edges
7. `alert_low_confidence()` - 4 edges
8. `alert_confidence_dropping()` - 4 edges
9. `alert_system_healthy()` - 4 edges
10. `upload_files()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `run_drift_detection()` --calls--> `alert_drift_detected()`  [INFERRED]
  D:\ModelGuard AI\monitoring\drift_detection.py → D:\ModelGuard AI\monitoring\alert_manager.py
- `run_performance_tracking()` --calls--> `alert_low_confidence()`  [INFERRED]
  D:\ModelGuard AI\monitoring\performance_tracker.py → D:\ModelGuard AI\monitoring\alert_manager.py
- `run_performance_tracking()` --calls--> `alert_confidence_dropping()`  [INFERRED]
  D:\ModelGuard AI\monitoring\performance_tracker.py → D:\ModelGuard AI\monitoring\alert_manager.py
- `run_drift_detection()` --calls--> `alert_system_healthy()`  [INFERRED]
  D:\ModelGuard AI\monitoring\drift_detection.py → D:\ModelGuard AI\monitoring\alert_manager.py
- `try_load()` --calls--> `load_model()`  [INFERRED]
  D:\ModelGuard AI\backend\app\main.py → D:\ModelGuard AI\backend\app\services\model_loader.py

## Hyperedges (group relationships)
- **ML/Data Science Stack** — requirements_sklearn, requirements_xgboost, requirements_pandas, requirements_numpy, requirements_joblib [INFERRED 0.90]
- **Frontend Static Assets** — favicon_svg_asset, icons_svg_asset, hero_png_asset, vite_svg_asset [INFERRED 0.80]

## Communities

### Community 0 - "API Server & Model Loader"
Cohesion: 0.26
Nodes (11): get_logs(), health(), load_demo(), metrics(), model_info(), status(), try_load(), upload_files() (+3 more)

### Community 1 - "Frontend API Client"
Cohesion: 0.36
Nodes (8): getDrift(), getHealth(), getLogs(), getMetrics(), getStatus(), loadDemo(), predict(), uploadModel()

### Community 2 - "Prediction Pipeline"
Cohesion: 0.29
Nodes (4): Base, predict(), predict_route(), PredictionLog

### Community 3 - "Analysis Page UI"
Cohesion: 0.48
Nodes (5): Analysis(), ConfidenceHeatmap(), GlassTooltip(), MiniGauge(), Sparkline()

### Community 4 - "Alert Management"
Cohesion: 0.67
Nodes (5): alert_confidence_dropping(), alert_drift_detected(), alert_low_confidence(), alert_system_healthy(), send_alert()

### Community 5 - "Performance Tracker"
Cohesion: 0.67
Nodes (5): check_health(), compute_metrics(), compute_rolling(), load_predictions(), run_performance_tracking()

### Community 6 - "Dashboard UI"
Cohesion: 0.53
Nodes (4): Dashboard(), GaugeChart(), GlassTooltip(), renderCustomLabel()

### Community 7 - "Logs Page UI"
Cohesion: 0.53
Nodes (4): ConfidenceTimeline(), Logs(), MiniDonut(), Sparkline()

### Community 8 - "Drift Detection"
Cohesion: 0.73
Nodes (4): compute_psi(), load_live_data(), load_reference_data(), run_drift_detection()

### Community 9 - "Settings Page"
Cohesion: 0.6
Nodes (3): Settings(), SettingsSection(), Toggle()

### Community 10 - "Upload Page"
Cohesion: 0.6
Nodes (3): DropZone(), StepIndicator(), Upload()

### Community 11 - "ML/Data Stack"
Cohesion: 0.4
Nodes (5): Joblib (model serialisation), NumPy, Pandas, Scikit-Learn, XGBoost

### Community 12 - "Support Page"
Cohesion: 0.67
Nodes (2): FAQ(), Support()

### Community 13 - "Frontend Assets & Entry"
Cohesion: 0.5
Nodes (4): Favicon SVG Asset, Icons SVG Sprite Sheet, SVG Favicon, React App Entry Point

### Community 14 - "Health API"
Cohesion: 0.67
Nodes (1): GET /health liveness check

### Community 15 - "Monitoring Scheduler"
Cohesion: 0.67
Nodes (1): GET /metrics, GET /drift

### Community 16 - "Core Config & DB"
Cohesion: 0.67
Nodes (1): get_db()

### Community 17 - "Sidebar Navigation"
Cohesion: 0.67
Nodes (1): DB table: drift scores

### Community 18 - "Metric Cards"
Cohesion: 0.67
Nodes (1): Shared utility functions

### Community 19 - "Prediction Logs DB"
Cohesion: 0.67
Nodes (1): App()

### Community 20 - "Drift Log Model"
Cohesion: 0.67
Nodes (1): MetricCard()

### Community 21 - "Logger Utility"
Cohesion: 0.67
Nodes (1): Navbar()

### Community 22 - "Helpers Utility"
Cohesion: 0.67
Nodes (1): Sidebar()

### Community 23 - "React Vite Setup"
Cohesion: 0.67
Nodes (3): ESLint Configuration, Hot Module Replacement (HMR), React + Vite Setup

### Community 24 - "Navbar Component"
Cohesion: 1.0
Nodes (2): FastAPI, Uvicorn ASGI Server

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (1): SQLAlchemy ORM

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (1): Hero/Landing Image Asset

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (1): Vite Logo SVG

## Knowledge Gaps
- **12 isolated node(s):** `FastAPI`, `Uvicorn ASGI Server`, `SQLAlchemy ORM`, `XGBoost`, `Pandas` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Support Page`** (4 nodes): `Support.jsx`, `Support.jsx`, `FAQ()`, `Support()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Health API`** (3 nodes): `health.py`, `health.py`, `GET /health liveness check`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Monitoring Scheduler`** (3 nodes): `metrics.py`, `metrics.py`, `GET /metrics, GET /drift`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Core Config & DB`** (3 nodes): `database.py`, `database.py`, `get_db()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sidebar Navigation`** (3 nodes): `drift_log.py`, `drift_log.py`, `DB table: drift scores`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Metric Cards`** (3 nodes): `helpers.py`, `helpers.py`, `Shared utility functions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prediction Logs DB`** (3 nodes): `App()`, `App.jsx`, `App.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Drift Log Model`** (3 nodes): `MetricCard.jsx`, `MetricCard.jsx`, `MetricCard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Logger Utility`** (3 nodes): `navbar.jsx`, `navbar.jsx`, `Navbar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Helpers Utility`** (3 nodes): `Sidebar.jsx`, `Sidebar.jsx`, `Sidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Navbar Component`** (2 nodes): `FastAPI`, `Uvicorn ASGI Server`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `SQLAlchemy ORM`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `Hero/Landing Image Asset`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `Vite Logo SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `run_performance_tracking()` connect `Performance Tracker` to `Alert Management`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `run_drift_detection()` connect `Drift Detection` to `Alert Management`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `run_performance_tracking()` (e.g. with `alert_low_confidence()` and `alert_confidence_dropping()`) actually correct?**
  _`run_performance_tracking()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `try_load()` (e.g. with `load_model()` and `load_preprocessor()`) actually correct?**
  _`try_load()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `run_drift_detection()` (e.g. with `alert_drift_detected()` and `alert_system_healthy()`) actually correct?**
  _`run_drift_detection()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `FastAPI`, `Uvicorn ASGI Server`, `SQLAlchemy ORM` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._