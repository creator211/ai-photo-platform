from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import os
import shutil
from datetime import datetime

from app.api.deps import get_current_user, get_db
from app.models import User, Celebrity, Photo
from app.schemas import PhotoUpload, PhotoResponse, CelebrityResponse
from app.tasks.photo_tasks import process_street_photo
from app.core.config import UPLOAD_DIR, ALLOWED_EXTENSIONS, MAX_FILE_SIZE

router = APIRouter()


# 挂载静态文件
def mount_static(app):
    app.mount("/static", StaticFiles(directory="static"), name="static")


@router.get("/celebrities", response_model=list[CelebrityResponse])
async def get_celebrities(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """获取明星列表"""
    query = select(Celebrity).where(Celebrity.is_active == True)
    
    if category:
        query = query.where(Celebrity.category == category)
    
    query = query.offset(skip).limit(limit).order_by(Celebrity.popularity.desc())
    
    result = await db.execute(query)
    celebrities = result.scalars().all()
    
    return celebrities


@router.post("/photos/upload", response_model=PhotoResponse)
async def upload_photo(
    file: UploadFile = File(...),
    celebrity_id: int = Form(...),
    effect_type: str = Form("street_candid"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """上传照片并发起合成任务"""
    # 验证文件类型
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # 验证文件大小
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large")
    
    # 检查明星是否存在
    celebrity_result = await db.execute(
        select(Celebrity).where(Celebrity.id == celebrity_id)
    )
    celebrity = celebrity_result.scalar_one_or_none()
    if not celebrity:
        raise HTTPException(status_code=404, detail="Celebrity not found")
    
    # 创建照片记录
    photo = Photo(
        user_id=current_user.id,
        celebrity_id=celebrity_id,
        original_path="",  # 待填入
        status="processing",
        effect_type=effect_type
    )
    db.add(photo)
    await db.commit()
    await db.refresh(photo)
    
    # 保存文件
    user_upload_dir = os.path.join(UPLOAD_DIR, str(current_user.id))
    os.makedirs(user_upload_dir, exist_ok=True)
    
    original_filename = f"{photo.id}_original.{ext}"
    original_path = os.path.join(user_upload_dir, original_filename)
    
    with open(original_path, "wb") as buffer:
        buffer.write(content)
    
    # 更新照片路径
    photo.original_path = original_path
    await db.commit()
    
    # 异步处理任务
    process_street_photo.delay(
        photo_id=photo.id,
        celebrity_id=celebrity_id,
        user_id=current_user.id,
        effect_type=effect_type
    )
    
    return photo


@router.get("/photos/{photo_id}", response_model=PhotoResponse)
async def get_photo(
    photo_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取照片详情"""
    result = await db.execute(
        select(Photo).where(Photo.id == photo_id, Photo.user_id == current_user.id)
    )
    photo = result.scalar_one_or_none()
    
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    return photo


@router.get("/photos/{photo_id}/result")
async def get_photo_result(
    photo_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取合成结果图片"""
    result = await db.execute(
        select(Photo).where(Photo.id == photo_id, Photo.user_id == current_user.id)
    )
    photo = result.scalar_one_or_none()
    
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    if photo.status != "completed" or not photo.result_path:
        raise HTTPException(status_code=400, detail="Photo not ready")
    
    return FileResponse(photo.result_path)
