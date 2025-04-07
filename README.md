# Tokenlink
## A Token-Based Semantic Association Mining Tool | 基于词元的语义关联挖掘工具
![image](https://github.com/user-attachments/assets/19e50f67-ef22-4880-b792-5832234672a5)

## Overview | 概述

Tokenlink is a tool for performing semantic association mining on text data. It allows users to input text, specify focus terms, and analyze the relationships between these terms within the text. The tool provides visualizations such as word frequency charts and word clouds to help users understand the semantic structure of the text.

Tokenlink 是一个用于对文本数据进行语义关联挖掘的工具。它允许用户输入文本，指定焦点词，并分析这些词在文本中的关系。该工具提供词频图表和词云等可视化功能，帮助用户理解文本的语义结构。

```
Tokenlink/
├── backend/                  # Backend code | 后端代码
│   ├── server.js            # Node.js server | Node.js 服务器
│   ├── analysis.js          # Semantic analysis logic | 语义分析逻辑
│   ├── utils.js             # Utility functions | 工具函数
│   ├── crypto-utils.js      # Encryption utilities | 加密工具
│   ├── config-manager.js    # Configuration management | 配置管理
│   ├── llm-service.js       # LLM service integration | 大语言模型服务集成
│   ├── api-config-routes.js # API configuration routes | API配置路由
│   ├── package.json         # Backend dependencies | 后端依赖
│   ├── Dockerfile           # Backend Dockerfile | 后端Docker配置
│   └── analysis.test.js     # Backend unit tests | 后端单元测试
├── frontend/                 # Frontend code | 前端代码
│   ├── index.html           # Home page | 主页
│   ├── app.js               # Frontend JavaScript | 前端JavaScript
│   ├── Settings.js          # Settings component | 设置组件
│   ├── style.css            # Stylesheet | 样式表
│   ├── visualization.js     # Visualization code | 可视化代码
│   ├── package.json         # Frontend dependencies | 前端依赖
│   ├── Dockerfile           # Frontend Dockerfile | 前端Docker配置
│   └── app.test.js          # Frontend unit tests | 前端单元测试
├── nginx.conf                # Nginx configuration file | Nginx配置文件
├── docker-compose.yml        # Docker Compose file | Docker Compose文件
├── deploy.sh                 # Deployment script | 部署脚本
├── start.sh                 # Startup script for Linux/macOS | Linux/macOS启动脚本
├── start.bat                # Startup script for Windows | Windows启动脚本
└── README.md                 # Project documentation | 项目文档
```

## Features | 功能特性

-   **Text Input | 文本输入**: Accepts text input for analysis. | 接受文本输入进行分析。
-   **Focus Terms | 焦点词**: Allows users to specify focus terms for targeted analysis. | 允许用户指定焦点词进行有针对性的分析。
-   **N-gram Size | N元语法大小**: Configurable n-gram size for tokenization. | 可配置的分词N元语法大小。
-   **Custom Stop Words | 自定义停用词**: Allows users to specify custom stop words to be excluded from the analysis. | 允许用户指定要从分析中排除的自定义停用词。
-   **Window Size | 窗口大小**: Configurable window size for calculating semantic associations. | 用于计算语义关联的可配置窗口大小。
-   **Minimum Frequency | 最小频率**: Configurable minimum frequency for filtering words. | 用于过滤词语的可配置最小频率。
-   **LLM API Configuration | 大语言模型API配置**: 
    -   Supports configuration of OpenAI and DeepSeek API keys. | 支持配置OpenAI和DeepSeek的API密钥。
    -   Securely stores API keys with encryption. | 使用加密安全存储API密钥。
    -   Allows switching between different LLM providers. | 允许在不同的大语言模型提供商之间切换。
-   **Cross-Platform Support | 跨平台支持**: 
    -   Startup scripts for Windows, macOS, and Linux. | 适用于Windows、macOS和Linux的启动脚本。
-   **Visualizations | 可视化**:
    -   Word Frequency Chart | 词频图表: Displays the frequency of words in the text. | 显示文本中词语的频率。
    -   Word Cloud | 词云: Provides a visual representation of word frequency. | 提供词频的可视化表示。

## Installation | 安装

### Prerequisites | 前提条件

-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Steps | 步骤

1.  **Clone the repository | 克隆仓库**:

    ```bash
    git clone https://github.com/XucroYuri/Tokenlink.git
    cd Tokenlink
    ```

2.  **Start the application using the cross-platform startup script | 使用跨平台启动脚本启动应用**:
    
    For Windows | 对于Windows:
    ```
    start.bat
    ```
    
    For macOS/Linux | 对于macOS/Linux:
    ```bash
    ./start.sh
    ```

    Alternatively, you can use the deployment script | 或者，您可以使用部署脚本:
    ```bash
    ./deploy.sh
    ```

    These scripts will:
    - Build the frontend using `npm`. | 使用`npm`构建前端。
    - Build the Docker images for the backend and frontend. | 构建后端和前端的Docker镜像。
    - Start the containers using Docker Compose. | 使用Docker Compose启动容器。

3.  **Access the application | 访问应用**:

    Open your web browser and navigate to `http://localhost`. | 打开您的网络浏览器并导航到`http://localhost`。

## Usage | 使用方法

1.  **Configure LLM API (Optional) | 配置大语言模型API（可选）**:
    - Click the settings icon in the top-right corner. | 点击右上角的设置图标。
    - Select your preferred LLM provider (DeepSeek or OpenAI). | 选择您首选的大语言模型提供商（DeepSeek或OpenAI）。
    - Enter your API key and click "Save Settings". | 输入您的API密钥并点击"保存设置

## Development

### Backend

-   **Language**: Node.js
-   **Framework**: Express
-   **Dependencies**: See `backend/package.json`
-   **Testing**: Jest

### Frontend

-   **Language**: JavaScript
-   **Libraries**: Tailwind CSS, Chart.js, D3.js, d3-cloud
-   **Dependencies**: See `frontend/package.json`
-   **Testing**: Jest

### Development Steps

1.  **Navigate to the project directory**:

    ```
    bash
    cd Tokenlink
    ```

2.  **Start the development server**:

    ```
    bash
    docker-compose up --build
    ```

    This will start the backend and frontend in development mode.

3.  **Make changes**:

    Modify the source code as needed. The application will automatically reload to reflect the changes.

## Contributing

This is an initial release, and we encourage you to:

- Suggest improvements via GitHub Issues.
- Submit code changes via Pull Requests.
- Fork the repository and develop new branches with better features.

See CONTRIBUTING.md for details on how to contribute.


## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact
For questions, reach out via GitHub Issues.
