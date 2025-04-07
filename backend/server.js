const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// 导入路由
const apiConfigRoutes = require('./api-config-routes');
const apiAnalysisRoutes = require('./api-analysis-routes');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 注册API路由
app.use('/api/config', apiConfigRoutes);
app.use('/api/analysis', apiAnalysisRoutes);

// 静态文件服务
app.use(express.static(path.join(__dirname, '../frontend')));

// 主路由 - 返回前端应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;
