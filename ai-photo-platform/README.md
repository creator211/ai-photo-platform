# AI Street Photo Platform

一个AI驱动的街拍合影生成平台，让用户可以上传照片与明星模板合成具有"抓拍感"的自然合影。

## ✨ 特性

- 🤖 **AI人脸替换** - 使用 InsightFace 进行高质量人脸替换
- 📸 **街拍风格** - 模拟自然抓拍效果：动态模糊、噪点、晕影
- 🖼️ **高清输出** - Real-ESRGAN 超分辨率增强
- ⚡ **异步处理** - Celery + Redis 任务队列
- 🔐 **用户认证** - JWT 身份验证
- 📱 **响应式设计** - Next.js + Tailwind CSS

## 🏗️ 技术栈

### 后端
- **FastAPI** - 高性能 Python Web 框架
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和消息队列
- **Celery** - 异步任务处理
- **InsightFace** - 人脸检测和替换
- **Real-ESRGAN** - 图像超分辨率

### 前端
- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式方案
- **Framer Motion** - 动画效果
- **Ant Design** - UI 组件库

## 🚀 快速开始

### 环境要求

- Docker & Docker Compose
- NVIDIA GPU (推荐，用于加速AI推理)
- 16GB+ RAM

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/ai-photo-platform.git
cd ai-photo-platform
```

### 2. 配置环境

```bash
# 复制环境变量模板
cp backend/.env.example backend/.env

# 编辑环境变量
vim backend/.env
```

### 3. 启动服务

```bash
# 使用 Docker Compose 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 4. 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

## 📁 项目结构

```
ai-photo-platform/
├── backend/
│   ├── app/
│   │   ├── api/           # API 路由
│   │   │   ├── auth.py    # 认证接口
│   │   │   └── photos.py  # 照片处理接口
│   │   ├── core/          # 核心配置
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── celery_app.py
│   │   ├── models/        # 数据模型
│   │   ├── schemas/       # Pydantic 模型
│   │   ├── services/      # 业务逻辑
│   │   │   └── face_swap.py
│   │   └── tasks/         # Celery 异步任务
│   │       └── photo_tasks.py
│   ├── static/            # 静态文件
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    # React 组件
│   │   ├── pages/         # Next.js 页面
│   │   └── styles/        # 全局样式
│   ├── public/            # 静态资源
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔧 API 文档

### 认证接口

#### 注册用户
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### 登录
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "yourpassword"
}
```

### 照片接口

#### 获取明星列表
```bash
GET /api/v1/celebrities
GET /api/v1/celebrities?category=actor
```

#### 上传照片
```bash
POST /api/v1/photos/upload
Content-Type: multipart/form-data

file: [图片文件]
celebrity_id: 1
effect_type: street_candid
```

#### 获取处理状态
```bash
GET /api/v1/photos/{photo_id}
Authorization: Bearer {token}
```

## 🎨 街拍效果配置

在 `backend/app/core/config.py` 中可以调整抓拍效果参数：

```python
STREET_PHOTO_EFFECTS = {
    "motion_blur_radius": 3,    # 动态模糊强度
    "noise_factor": 0.03,       # 噪点强度
    "vignette_strength": 0.3,    # 晕影强度
    "warmth_filter": 5,          # 暖色滤镜
}
```

## 📦 部署

### 生产环境

```bash
# 构建生产镜像
docker-compose -f docker-compose.prod.yml build

# 启动生产服务
docker-compose -f docker-compose.prod.yml up -d
```

### 服务器要求

- CPU: 4 核心+
- RAM: 16GB+
- GPU: NVIDIA GPU (推荐 RTX 3080+)
- Storage: 100GB+ SSD

## 🤝 贡献

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。

## 📞 联系

- 项目地址: https://github.com/yourusername/ai-photo-platform
- 问题反馈: https://github.com/yourusername/ai-photo-platform/issues
