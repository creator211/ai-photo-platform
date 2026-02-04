# AI Street Photo Platform - 快速部署指南

## 🚀 一键部署到 Railway + Vercel

### 第一步：推送代码到 GitHub

```bash
# 在项目根目录执行
cd ai-photo-platform

# 初始化 git（如果还没初始化）
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库并推送
gh repo create ai-photo-platform --public --source=. --push
# 或者手动在 GitHub.com 创建仓库，然后：
# git remote add origin https://github.com/你的用户名/ai-photo-platform.git
# git branch -M main
# git push -u origin main
```

### 第二步：部署后端到 Railway

1. 打开 https://railway.com 并登录（用 GitHub 账号）
2. 点击 **"New Project"**
3. 选择 **"Deploy from GitHub repo"**
4. 选择 `ai-photo-platform` 仓库
5. 在 **"Root Directory"** 选择 `backend`
6. 点击 **"Deploy Now"**

7. **添加数据库和缓存**：
   - 点击项目中的 **"+ Add Plugins"**
   - 添加 **PostgreSQL**（自动创建数据库）
   - 添加 **Redis**（用于 Celery 任务队列）

8. **配置环境变量**：
   - 点击 **"Variables"** 标签
   - 添加以下变量（Railway 会自动生成 `POSTGRES_URL` 和 `REDIS_URL`）：

   ```
   SECRET_KEY=openssl rand -hex 32
   DEBUG=false
   DATABASE_URL=${POSTGRES_URL}
   REDIS_URL=${REDIS_URL}
   CELERY_BROKER_URL=${REDIS_URL}
   CELERY_RESULT_BACKEND=${REDIS_URL}
   ```

9. **等待部署完成**，然后点击 **"Settings"** → **"Domains"**
   - 复制你的后端域名，例如：`https://ai-photo-platform-backend.railway.app`

### 第三步：部署前端到 Vercel

1. 打开 https://vercel.com 并登录（用 GitHub 账号）
2. 点击 **"Add New..."** → **"Project"**
3. 选择 `ai-photo-platform` 仓库
4. 配置：
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`

5. 在 **"Environment Variables"** 添加：

   ```
   NEXT_PUBLIC_API_URL=https://你的railway域名.railway.app
   ```

6. 点击 **"Deploy"** 等待完成

7. 部署完成后，Vercel 会给你一个域名，例如：
   `https://ai-photo-platform-frontend.vercel.app`

### 第四步：访问你的网站！

- **前端**：Vercel 域名
- **后端 API**：Railway 域名
- **API 文档**：Railway 域名 + `/docs`

---

## 🛠️ 常见问题

### 1. Railway 部署失败
- 检查 `requirements.txt` 中的依赖是否兼容 Python 3.11
- 查看 Railway 日志定位具体错误

### 2. 前端无法连接后端
- 确保 `NEXT_PUBLIC_API_URL` 配置正确（不带尾部斜杠）
- 检查后端 CORS 配置是否允许 Vercel 域名

### 3. 人脸替换功能不工作
- Railway 免费层可能没有足够 GPU
- 考虑使用 GPU 增强计划或换用其他支持 GPU 的平台（如 Render、RunPod）

### 4. 图片上传失败
- 检查 Railway 磁盘配额
- Railway 免费层有 1GB 磁盘限制

---

## 💰 费用估算

| 服务 | 免费额度 | 超出费用 |
|------|---------|---------|
| Railway | 500小时/月 + 1GB 磁盘 | $5/100小时 |
| Vercel | 100GB 带宽/月 | $20/100GB |
| PostgreSQL (Railway) | 免费 | $5/月 |
| Redis (Railway) | 免费 | $5/月 |

**小项目基本免费**，大流量项目可能需要付费。
