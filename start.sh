#!/bin/bash

# Tokenlink 启动脚本 - Linux/macOS 版本
# Tokenlink Startup Script - Linux/macOS Version

echo "正在启动 Tokenlink..."
echo "Starting Tokenlink..."

# 检查操作系统类型
# Check operating system type
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "检测到 macOS 系统"
    echo "Detected macOS system"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "检测到 Linux 系统"
    echo "Detected Linux system"
else
    echo "未知操作系统类型: $OSTYPE"
    echo "Unknown operating system type: $OSTYPE"
fi

# 检查是否安装了Docker
# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "错误: 未安装Docker。请先安装Docker和Docker Compose。"
    echo "Error: Docker is not installed. Please install Docker and Docker Compose first."
    exit 1
fi

# 检查是否安装了Docker Compose
# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "错误: 未安装Docker Compose。请先安装Docker Compose。"
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# 启动应用
# Start the application
echo "正在构建并启动Docker容器..."
echo "Building and starting Docker containers..."
docker-compose up --build

echo "Tokenlink 已启动! 访问 http://localhost 使用应用程序。"
echo "Tokenlink is running! Visit http://localhost to access the application."