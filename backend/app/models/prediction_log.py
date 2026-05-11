from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class PredictionLog(Base):
    __tablename__ = "prediction_logs"

    id               = Column(Integer, primary_key=True, index=True)
    input_features   = Column(String,  nullable=False)   # JSON string of input
    prediction       = Column(Integer, nullable=False)   # 0 = stays, 1 = churns
    prediction_label = Column(String,  nullable=False)   # "Stays" or "Churns"
    confidence       = Column(Float,   nullable=False)   # probability score
    timestamp        = Column(DateTime, server_default=func.now())