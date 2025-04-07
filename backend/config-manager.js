/**
 * 配置管理模块 - 用于管理API密钥和其他配置
 * Configuration Management Module - For managing API keys and other configurations
 */

const fs = require('fs');
const path = require('path');
const cryptoUtils = require('./crypto-utils');

// 配置文件路径
// Configuration file path
const CONFIG_PATH = path.join(__dirname, 'config.json');

// 默认配置
// Default configuration
const DEFAULT_CONFIG = {
  llm: {
    provider: 'deepseek',
    apiKeys: {},
    models: {
      openai: 'gpt-4o',
      deepseek: 'deepseek-chat'
    }
  },
};

/**
 * 确保配置文件存在
 * Ensure configuration file exists
 * @returns {Object} - 配置对象 (configuration object)
 */
function ensureConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            // 创建默认配置文件
            // Create default configuration file
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), { mode: 0o600 });
            return DEFAULT_CONFIG;
        } else {
            // 读取现有配置
            // Read existing configuration
            const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
            return JSON.parse(configData);
        }
    } catch (error) {
        console.error('Error managing configuration:', error);
        return DEFAULT_CONFIG;
    }
}

/**
 * 获取配置
 * Get configuration
 * @returns {Object} - 配置对象 (configuration object)
 */
function getConfig() {
    return ensureConfig();
}

/**
 * 保存配置
 * Save configuration
 * @param {Object} config - 配置对象 (configuration object)
 */
function saveConfig(config) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), { mode: 0o600 });
    } catch (error) {
        console.error('Error saving configuration:', error);
        throw new Error('Failed to save configuration');
    }
}

/**
 * 设置LLM提供商
 * Set LLM provider
 * @param {string} provider - 提供商名称 (provider name)
 */
function setLLMProvider(provider) {
    const config = getConfig();
    config.llm.provider = provider;
    saveConfig(config);
}

/**
 * 获取当前LLM提供商
 * Get current LLM provider
 * @returns {string} - 提供商名称 (provider name)
 */
function getLLMProvider() {
    const config = getConfig();
    return config.llm.provider;
}

/**
 * 设置API密钥
 * Set API key
 * @param {string} provider - 提供商名称 (provider name)
 * @param {string} apiKey - API密钥 (API key)
 */
function setAPIKey(provider, apiKey) {
    const config = getConfig();
    
    // 加密API密钥
    // Encrypt API key
    const encryptedKey = cryptoUtils.encrypt(apiKey);
    
    // 保存加密后的密钥
    // Save encrypted key
    config.llm.apiKeys[provider] = encryptedKey;
    saveConfig(config);
}

/**
 * 获取API密钥
 * Get API key
 * @param {string} provider - 提供商名称 (provider name)
 * @returns {string|null} - API密钥或null (API key or null)
 */
function getAPIKey(provider) {
    const config = getConfig();
    const encryptedKey = config.llm.apiKeys[provider];
    
    if (!encryptedKey) {
        return null;
    }
    
    try {
        // 解密API密钥
        // Decrypt API key
        return cryptoUtils.decrypt(encryptedKey);
    } catch (error) {
        console.error(`Error decrypting API key for ${provider}:`, error);
        return null;
    }
}

/**
 * 检查是否有API密钥
 * Check if API key exists
 * @param {string} provider - 提供商名称 (provider name)
 * @returns {boolean} - 是否存在API密钥 (whether API key exists)
 */
function hasAPIKey(provider) {
    const config = getConfig();
    return !!config.llm.apiKeys[provider];
}

/**
 * 获取所有配置的提供商
 * Get all configured providers
 * @returns {string[]} - 提供商名称数组 (array of provider names)
 */
function getConfiguredProviders() {
    const config = getConfig();
    return Object.keys(config.llm.apiKeys);
}

module.exports = {
    getConfig,
    setLLMProvider,
    getLLMProvider,
    setAPIKey,
    getAPIKey,
    hasAPIKey,
    getConfiguredProviders
};