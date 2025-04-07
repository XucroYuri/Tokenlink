@echo off
REM Tokenlink 启动脚本 - Windows 版本
REM Tokenlink Startup Script - Windows Version

echo 正在启动 Tokenlink...
echo Starting Tokenlink...

REM 检查是否安装了Docker
REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未安装Docker。请先安装Docker和Docker Compose。
    echo Error: Docker is not installed. Please install Docker and Docker Compose first.
    exit /b 1
)

REM 检查是否安装了Docker Compose
REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未安装Docker Compose。请先安装Docker Compose。
    echo Error: Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM 启动应用
REM Start the application
echo 正在构建并启动Docker容器...
echo Building and starting Docker containers...
docker-compose up --build

echo Tokenlink 已启动! 访问 http://localhost 使用应用程序。
echo Tokenlink is running! Visit http://localhost to access the application.