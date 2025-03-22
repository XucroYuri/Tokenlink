# Tokenlink: A Token-Based Semantic Association Mining Tool

## Overview

Tokenlink is a tool for performing semantic association mining on text data. It allows users to input text, specify focus terms, and analyze the relationships between these terms within the text. The tool provides visualizations such as word frequency charts and word clouds to help users understand the semantic structure of the text.

```
Tokenlink/
├── backend/                  # 后端代码
│   ├── server.js            # Node.js 服务器
│   ├── analysis.js          # 语义分析逻辑
│   ├── utils.js             # 实用工具函数
│   ├── package.json         # 后端依赖
│   ├── Dockerfile           # 后端 Dockerfile
│   └── analysis.test.js     # 后端单元测试
├── frontend/                 # 前端代码
│   ├── index.html           # HTML 页面
│   ├── app.js               # 前端 JavaScript
│   ├── style.css            # 样式文件
│   ├── visualization.js     # 可视化代码
│   ├── package.json         # 前端依赖
│   ├── Dockerfile           # 前端 Dockerfile
│   └── app.test.js          # 前端单元测试
├── nginx.conf                # Nginx 配置文件
├── docker-compose.yml        # Docker Compose 文件
├── deploy.sh                 # 部署脚本
└── README.md                 # 项目说明
```

## Features

-   **Text Input**: Accepts text input for analysis.
-   **Focus Terms**: Allows users to specify focus terms for targeted analysis.
-   **N-gram Size**: Configurable n-gram size for tokenization.
-   **Custom Stop Words**: Allows users to specify custom stop words to be excluded from the analysis.
-   **Window Size**: Configurable window size for calculating semantic associations.
-   **Minimum Frequency**: Configurable minimum frequency for filtering words.
-   **Visualizations**:
    -   Word Frequency Chart: Displays the frequency of words in the text.
    -   Word Cloud: Provides a visual representation of word frequency.

## Installation

### Prerequisites

-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Steps

1.  **Clone the repository**:

    ```
    bash
    git clone https://github.com/XucroYuri/Tokenlink.git
    cd Tokenlink
    ```


2.  **Build and deploy the application using Docker Compose**:
    ```
    bash
    ./deploy.sh
    ```

    This script will:

    -   Build the frontend using `npm`.
    -   Build the Docker images for the backend and frontend.
    -   Start the containers using Docker Compose.

3.  **Access the application**:

    Open your web browser and navigate to `http://localhost`.

## Usage

1.  **Enter Text**: Input the text you want to analyze in the text area.
2.  **Focus Terms**: Specify the focus terms, separated by commas.
3.  **Configure Parameters**: Adjust the n-gram size, custom stop words, window size, and minimum frequency as needed.
4.  **Analyze Text**: Click the "Analyze Text" button.
5.  **View Results**: The analysis results, including token count, word frequency chart, and word cloud, will be displayed below the input form.

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

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes.
4.  Submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
