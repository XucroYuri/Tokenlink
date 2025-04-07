/**
 * API配置路由 - 处理API设置相关的请求
 * API Configuration Routes - Handle requests related to API settings
 */

const express = require('express');
const configManager = require('./config-manager');
const llmService = require('./llm-service');

const router = express.Router();

/**
 * 获取当前LLM配置
 * Get current LLM configuration
 */
router.get('/config/llm', (req, res) => {
    try {
        const provider = configManager.getLLMProvider();
        const configuredProviders = configManager.getConfiguredProviders();
        const supportedProviders = llmService.getSupportedProviders();
        
        res.json({
            currentProvider: provider,
            configuredProviders: configuredProviders,
            supportedProviders: supportedProviders,
            isConfigured: llmService.isLLMConfigured()
        });
    } catch (error) {
        console.error('Error getting LLM configuration:', error);
        res.status(500).json({ error: 'Failed to get LLM configuration' });
    }
});

/**
 * 设置LLM提供商
 * Set LLM provider
 */
router.post('/config/llm/provider', (req, res) => {
    try {
        const { provider } = req.body;
        
        if (!provider) {
            return res.status(400).json({ error: 'Provider is required' });
        }
        
        const supportedProviders = llmService.getSupportedProviders();
        if (!supportedProviders.includes(provider)) {
            return res.status(400).json({ error: `Unsupported provider: ${provider}` });
        }
        
        configManager.setLLMProvider(provider);
        
        res.json({ success: true, provider });
    } catch (error) {
        console.error('Error setting LLM provider:', error);
        res.status(500).json({ error: 'Failed to set LLM provider' });
    }
});

/**
 * 设置API密钥
 * Set API key
 */
router.post('/config/llm/apikey', (req, res) => {
    try {
        const { provider, apiKey } = req.body;
        
        if (!provider || !apiKey) {
            return res.status(400).json({ error: 'Provider and API key are required' });
        }
        
        const supportedProviders = llmService.getSupportedProviders();
        if (!supportedProviders.includes(provider)) {
            return res.status(400).json({ error: `Unsupported provider: ${provider}` });
        }
        
        configManager.setAPIKey(provider, apiKey);
        
        res.json({ success: true, provider });
    } catch (error) {
        console.error('Error setting API key:', error);
        res.status(500).json({ error: 'Failed to set API key' });
    }
});

/**
 * 测试LLM连接
 * Test LLM connection
 */
router.post('/config/llm/test', async (req, res) => {
    try {
        const { provider } = req.body;
        
        if (!provider) {
            return res.status(400).json({ error: 'Provider is required' });
        }
        
        const supportedProviders = llmService.getSupportedProviders();
        if (!supportedProviders.includes(provider)) {
            return res.status(400).json({ error: `Unsupported provider: ${provider}` });
        }
        
        if (!configManager.hasAPIKey(provider)) {
            return res.status(400).json({ error: `API key for ${provider} is not configured` });
        }
        
        // 发送简单的测试请求
        // Send a simple test request
        const response = await llmService.callLLM('Hello, this is a test message.', { provider });
        
        res.json({
            success: true,
            provider,
            model: response.model,
            message: 'Connection successful'
        });
    } catch (error) {
        console.error('Error testing LLM connection:', error);
        res.status(500).json({ error: `Connection test failed: ${error.message}` });
    }
});

module.exports = router;