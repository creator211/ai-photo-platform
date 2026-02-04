from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# 用户相关
class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    avatar: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# 明星相关
class CelebrityResponse(BaseModel):
    id: int
    name: str
    category: str
    thumbnail_path: Optional[str]
    description: Optional[str]
    popularity: int
    
    class Config:
        from_attributes = True


# 照片相关
class PhotoUpload(BaseModel):
    celebrity_id: int
    effect_type: str = "street_candid"


class PhotoResponse(BaseModel):
    id: int
    user_id: int
    celebrity_id: int
    original_path: str
    result_path: Optional[str]
    status: str
    effect_type: str
    quality_score: Optional[float]
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class PhotoWithCelebrity(PhotoResponse):
    celebrity: CelebrityResponse
