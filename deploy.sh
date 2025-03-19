#!/bin/bash

# 1. 构建前端
echo "Building frontend..."
cd frontend # 确保在前端项目根目录下
npm install  # 安装前端依赖
npm run build
cd ..

# 2. 构建和启动 Docker 容器
echo "Building and starting Docker containers..."
docker-compose up --build

echo "Deployment complete! Visit http://localhost to access the application."
