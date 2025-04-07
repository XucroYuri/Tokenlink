#!/bin/bash

# 1. 构建前端
echo "Building frontend..."
cd frontend
npm install
mkdir -p dist
npx tailwindcss -i ./style.css -o ./dist/style.css --minify
cd ..

# 2. 构建后端
echo "Building backend..."
cd backend
npm install
cd ..

# 3. 启动后端服务器
echo "Starting backend server..."
cd backend
PORT=3000 node server.js &
BACKEND_PID=$!
cd ..

# 4. 启动前端服务器
echo "Starting frontend server..."
cd frontend
# 使用http-server启动前端，-c-1禁用缓存，-P参数设置代理将API请求转发到后端服务器
npx http-server -c-1 -P http://localhost:3000 . &
FRONTEND_PID=$!
cd ..

echo "Development servers started!"
echo "Backend running at http://localhost:3000"
echo "Frontend running at http://localhost:8080"
echo "Access the application at http://localhost:8080"
echo "API endpoints available at http://localhost:3000/api"
echo "Press Ctrl+C to stop both servers"

# 捕获 SIGINT 信号（Ctrl+C）
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# 等待子进程
wait