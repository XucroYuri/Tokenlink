#!/bin/bash

# 1. 构建前端
# 1. Build the frontend
echo "Building frontend..."
cd frontend # 确保在前端项目根目录下
# Ensure in the frontend project root directory
npm install  # 安装前端依赖
# Install frontend dependencies
npm run build
cd ..

# 2. 构建和启动 Docker 容器
# 2. Build and start Docker containers
echo "Building and starting Docker containers..."
docker-compose up --build

echo "Deployment complete! Visit http://localhost to access the application."
