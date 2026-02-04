# 应用配置
APP_NAME = "AI Street Photo Platform"
DEBUG = True
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7天

# 数据库配置
DATABASE_URL = "postgresql+asyncpg://postgres:password@localhost:5432/ai_photo_db"
REDIS_URL = "redis://localhost:6379/0"

# 文件存储
UPLOAD_DIR = "static/uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

# Celery配置
CELERY_BROKER_URL = "redis://localhost:6379/1"
CELERY_RESULT_BACKEND = "redis://localhost:6379/2"

# AI模型配置
FACE_SWAP_MODEL = "insightface"
ENHANCEMENT_MODEL = "realesrgan"
BACKGROUND_MODEL = "rembg"

# 明星模板库路径
CELEBRITY_TEMPLATES_DIR = "static/celebrities"

# 抓拍效果配置
STREET_PHOTO_EFFECTS = {
    "motion_blur_radius": 3,
    "noise_factor": 0.03,
    "vignette_strength": 0.3,
    "warmth_filter": 5,
}
