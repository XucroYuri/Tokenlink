#!/bin/bash

# 1. 构建前端
echo "Building frontend..."
cd frontend
npm install
# 确保 tailwindcss 命令可用
npx tailwindcss -i ./style.css -o ./dist/style.css --minify
cd ..

# 2. 构建后端
echo "Building backend..."
cd backend
npm install
cd ..

# 3. 检查 Docker 和 Docker Compose 是否安装
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    echo "Visit https://docs.docker.com/get-docker/ for installation instructions."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Trying to use 'docker compose' instead..."
    if ! docker compose version &> /dev/null; then
        echo "Neither 'docker-compose' nor 'docker compose' is available."
        echo "Please install Docker Compose or use Docker Desktop which includes it."
        echo "Visit https://docs.docker.com/compose/install/ for installation instructions."
        exit 1
    fi
    # 使用 docker compose 替代 docker-compose
    echo "Building and starting Docker containers..."
    docker compose up --build -d
else
    # 使用 docker-compose
    echo "Building and starting Docker containers..."
    docker-compose up --build -d
fi

echo "Deployment complete! Visit http://localhost to access the application."
