import cv2
import numpy as np
from typing import Optional
import time
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.celery_app import celery_app
from app.services import FaceSwapService, BackgroundService, ImageEnhancer, StreetPhotoEffect
from app.models import Photo, Celebrity
from app.core.config import STREEEET_PHOTO_EFFECTS
import os


# 初始化服务（全局复用）
_face_swap_service = None
_background_service = None
_enhancer = None
_effect_service = None


def get_services():
    global _face_swap_service, _background_service, _enhancer, _effect_service
    
    if _face_swap_service is None:
        _face_swap_service = FaceSwapService()
    if _background_service is None:
        _background_service = BackgroundService()
    if _enhancer is None:
        _enhancer = ImageEnhancer()
    if _effect_service is None:
        _effect_service = StreetPhotoEffect(STREEEET_PHOTO_EFFECTS)
    
    return _face_swap_service, _background_service, _enhancer, _effect_service


@celery_app.task(bind=True)
def process_street_photo(
    self, 
    photo_id: int,
    celebrity_id: int,
    user_id: int,
    effect_type: str = "street_candid"
):
    """处理街拍照片合成任务"""
    start_time = time.time()
    
    try:
        # 获取服务
        face_swap, bg_service, enhancer, effect_service = get_services()
        
        # TODO: 从数据库获取原图和明星模板路径
        # 这里需要传入文件路径
        original_path = f"static/uploads/{user_id}/{photo_id}_original.jpg"
        celebrity_path = f"static/celebrities/{celebrity_id}/template.jpg"
        result_path = f"static/uploads/{user_id}/{photo_id}_result.jpg"
        
        # 读取图片
        original_img = cv2.imread(original_path)
        celebrity_img = cv2.imread(celebrity_path)
        
        if original_img is None or celebrity_img is None:
            raise FileNotFoundError("Source images not found")
        
        # 1. 人脸替换
        swapped_img = face_swap.swap_face(celebrity_img, original_img)
        
        # 2. 背景处理（如果需要）
        # mask = bg_service.remove_background(original_img)
        
        # 3. 增强画质
        enhanced_img = enhancer.enhance(swapped_img)
        
        # 4. 应用街拍效果
        if effect_type == "street_candid":
            final_img = effect_service.apply_candid_effect(enhanced_img)
        else:
            final_img = enhanced_img
        
        # 5. 保存结果
        os.makedirs(os.path.dirname(result_path), exist_ok=True)
        cv2.imwrite(result_path, final_img, [cv2.IMWRITE_JPEG_QUALITY, 95])
        
        # 计算处理时间
        processing_time = time.time() - start_time
        
        # TODO: 更新数据库状态
        # result = await session.execute(select(Photo).where(Photo.id == photo_id))
        # photo = result.scalar_one()
        # photo.status = "completed"
        # photo.result_path = result_path
        # photo.processing_time = processing_time
        # await session.commit()
        
        return {
            "status": "success",
            "photo_id": photo_id,
            "result_path": result_path,
            "processing_time": f"{processing_time:.2f}s"
        }
        
    except Exception as e:
        # 更新失败状态
        # await session.execute(
        #     select(Photo).where(Photo.id == photo_id)
        # )
        # photo.status = "failed"
        # await session.commit()
        
        return {
            "status": "failed",
            "photo_id": photo_id,
            "error": str(e)
        }
