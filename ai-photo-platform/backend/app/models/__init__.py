from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.database import Base
from datetime import datetime


class User(Base):
    """用户模型"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    avatar = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    photos = relationship("Photo", back_populates="owner")


class Celebrity(Base):
    """明星模板模型"""
    __tablename__ = "celebrities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), default="actor")  # actor, singer, model, athlete
    template_path = Column(String(500), nullable=False)
    thumbnail_path = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    popularity = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Photo(Base):
    """用户照片模型"""
    __tablename__ = "photos"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    celebrity_id = Column(Integer, ForeignKey("celebrities.id"), nullable=False)
    
    original_path = Column(String(500), nullable=False)
    result_path = Column(String(500), nullable=True)
    
    status = Column(String(20), default="processing")  # processing, completed, failed
    effect_type = Column(String(50), default="street_candid")  # street_candid, red_carpet, casual
    
    quality_score = Column(Float, nullable=True)
    processing_time = Column(Float, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    owner = relationship("User", back_populates="photos")
    celebrity = relationship("Celebrity")
