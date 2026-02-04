import cv2
import numpy as np
from PIL import Image
from typing import Optional, Tuple
import insightface
from insightface.app import FaceAnalysis
import torch
from Rembg import Rembg
from realesrgan import RealESRGAN
import os


class FaceSwapService:
    """人脸替换服务"""
    
    def __init__(self):
        self.app = FaceAnalysis(name='buffalo_l')
        self.app.prepare(ctx_id=0, det_size=(640, 640))
        
    def swap_face(
        self, 
        source_img: np.ndarray, 
        target_img: np.ndarray,
        source_face_index: int = 0,
        target_face_index: int = 0
    ) -> np.ndarray:
        """执行人脸替换"""
        # 检测源图片人脸
        source_faces = self.app.get(source_img)
        if len(source_faces) == 0:
            raise ValueError("Source image has no face detected")
        
        # 检测目标图片人脸
        target_faces = self.app.get(target_img)
        if len(target_faces) == 0:
            raise ValueError("Target image has no face detected")
        
        # 选择人脸
        source_face = source_faces[source_face_index]
        target_face = target_faces[target_face_index]
        
        # 创建交换器
        swapper = insightface.model_zoo.get_model(
            'onnxruntime/models/swapper.onnx', 
            providers=['CUDAExecutionProvider', 'CPUExecutionProvider']
        )
        
        # 执行替换
        result = swapper.get(
            target_img, 
            target_face, 
            source_face, 
            paste_back=True
        )
        
        return result
    
    def get_face_info(self, img: np.ndarray) -> list:
        """获取人脸信息"""
        return self.app.get(img)


class BackgroundService:
    """背景处理服务"""
    
    def __init__(self):
        self.rembg = Rembg()
    
    def remove_background(self, img: np.ndarray) -> np.ndarray:
        """移除背景"""
        result = self.rembg.remove(img)
        return result
    
    def get_mask(self, img: np.ndarray) -> np.ndarray:
        """获取前景 mask"""
        result = self.rembg.remove(img)
        mask = result[:, :, 3]
        mask = (mask / 255.0).astype(np.uint8)
        return mask


class ImageEnhancer:
    """图片增强服务"""
    
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.enhancer = RealESRGAN(
            scale=4,
            model_path='realesrgan-x4plus',
            device=self.device
        )
    
    def enhance(self, img: np.ndarray) -> np.ndarray:
        """超分辨率增强"""
        # 转换 BGR to RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img_pil = Image.fromarray(img_rgb)
        
        # 增强
        output, _ = self.enhancer.enhance(img_pil, outscale=4)
        
        # 转换回 BGR
        result = cv2.cvtColor(np.array(output), cv2.COLOR_RGB2BGR)
        return result


class StreetPhotoEffect:
    """街拍效果处理"""
    
    def __init__(self, config: dict = None):
        self.config = config or {
            "motion_blur_radius": 3,
            "noise_factor": 0.03,
            "vignette_strength": 0.3,
            "warmth_filter": 5,
        }
    
    def apply_candid_effect(self, img: np.ndarray) -> np.ndarray:
        """应用街拍抓拍效果"""
        result = img.copy()
        
        # 1. 轻微动态模糊（模拟跟拍）
        if self.config.get("motion_blur_radius", 0) > 0:
            result = self._motion_blur(result, self.config["motion_blur_radius"])
        
        # 2. 添加噪点（街拍高感光度感）
        if self.config.get("noise_factor", 0) > 0:
            result = self._add_noise(result, self.config["noise_factor"])
        
        # 3. 晕影效果
        if self.config.get("vignette_strength", 0) > 0:
            result = self._vignette(result, self.config["vignette_strength"])
        
        # 4. 暖色滤镜
        if self.config.get("warmth_filter", 0) > 0:
            result = self._warmth(result, self.config["warmth_filter"])
        
        return result
    
    def _motion_blur(self, img: np.ndarray, radius: int) -> np.ndarray:
        """径向动态模糊"""
        kernel = np.zeros((radius * 2 + 1, radius * 2 + 1))
        kernel[radius, :] = 1
        kernel = kernel / (radius * 2 + 1)
        return cv2.filter2D(img, -1, kernel)
    
    def _add_noise(self, img: np.ndarray, factor: float) -> np.ndarray:
        """添加高斯噪点"""
        noise = np.random.normal(0, factor * 255, img.shape).astype(np.int16)
        result = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        return result
    
    def _vignette(self, img: np.ndarray, strength: float) -> np.ndarray:
        """晕影效果"""
        rows, cols = img.shape[:2]
        kernel_x = cv2.getGaussianKernel(cols, cols / 2)
        kernel_y = cv2.getGaussianKernel(rows, rows / 2)
        kernel = kernel_y * kernel_x.T
        mask = kernel / kernel.max()
        mask = mask * strength + (1 - strength)
        
        result = img.copy().astype(np.float32)
        for i in range(3):
            result[:, :, i] = result[:, :, i] * mask
        
        return result.astype(np.uint8)
    
    def _warmth(self, img: np.ndarray, amount: int) -> np.ndarray:
        """暖色滤镜"""
        result = img.copy()
        result[:, :, 0] = cv2.add(result[:, :, 0], -amount)  # 减少蓝色
        result[:, :, 2] = cv2.add(result[:, :, 2], amount)   # 增加红色
        return result
