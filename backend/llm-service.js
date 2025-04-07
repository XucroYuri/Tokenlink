const axios = require('axios');
const configManager = require('./config-manager');
const cryptoUtils = require('./crypto-utils');
const promptFramework = require('./prompt-framework');

/**
 * 调用大语言模型API
 * @param {string} prompt - 提示词
 * @param {string} provider - 提供商 (openai 或 deepseek)
 * @returns {Promise<Object>} 模型响应
 */
async function callLLMAPI(prompt, provider = null) {
  const config = configManager.getConfig();
  
  // 如果未指定提供商，使用当前配置的提供商
  provider = provider || config.llm.currentProvider;
  
  // 获取API密钥
  const encryptedApiKey = config.llm.apiKeys[provider];
  if (!encryptedApiKey) {
    throw new Error(`未配置 ${provider} 的API密钥`);
  }
  
  // 解密API密钥
  const apiKey = cryptoUtils.decrypt(encryptedApiKey);
  
  // 获取模型名称
  const modelName = config.llm.models[provider];
  
  // 根据不同提供商构建请求
  let response;
  
  try {
    if (provider === 'openai') {
      response = await callOpenAI(prompt, apiKey, modelName);
    } else if (provider === 'deepseek') {
      response = await callDeepSeek(prompt, apiKey, modelName);
    } else {
      throw new Error(`不支持的提供商: ${provider}`);
    }
    
    return response;
  } catch (error) {
    console.error(`调用 ${provider} API 失败:`, error);
    throw new Error(`调用 ${provider} API 失败: ${error.message}`);
  }
}

/**
 * 调用 OpenAI API
 * @param {string} prompt - 提示词
 * @param {string} apiKey - API密钥
 * @param {string} model - 模型名称
 * @returns {Promise<Object>} 模型响应
 */
async function callOpenAI(prompt, apiKey, model) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant specialized in text analysis.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return {
    text: response.data.choices[0].message.content,
    usage: response.data.usage,
    provider: 'openai',
    model: model
  };
}

/**
 * 调用 DeepSeek API
 * @param {string} prompt - 提示词
 * @param {string} apiKey - API密钥
 * @param {string} model - 模型名称
 * @returns {Promise<Object>} 模型响应
 */
async function callDeepSeek(prompt, apiKey, model) {
  const response = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant specialized in text analysis.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return {
    text: response.data.choices[0].message.content,
    usage: response.data.usage,
    provider: 'deepseek',
    model: model
  };
}

/**
 * 执行文本分析
 * @param {string} text - 要分析的文本
 * @param {string} analysisType - 分析类型
 * @param {Object} options - 分析选项
 * @returns {Promise<Object>} 分析结果
 */
async function analyzeText(text, analysisType, options = {}) {
  // 准备变量
  const variables = {
    TEXT: text,
    ...options
  };
  
  // 生成prompt
  const prompt = promptFramework.generatePrompt(analysisType, variables);
  
  // 调用LLM API
  const response = await callLLMAPI(prompt);
  
  // 尝试解析JSON响应
  try {
    // 提取JSON部分（如果响应包含其他文本）
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : response.text;
    
    // 解析JSON
    const result = JSON.parse(jsonStr);
    
    return {
      result,
      metadata: {
        provider: response.provider,
        model: response.model,
        tokenUsage: response.usage,
        analysisType
      }
    };
  } catch (error) {
    console.error('解析LLM响应失败:', error);
    return {
      error: '解析响应失败',
      rawResponse: response.text,
      metadata: {
        provider: response.provider,
        model: response.model,
        tokenUsage: response.usage,
        analysisType
      }
    };
  }
}

/**
 * 获取支持的LLM提供商列表
 * @returns {string[]} 支持的提供商列表
 */
function getSupportedProviders() {
  return ['openai', 'deepseek'];
}

/**
 * 检查LLM是否已配置
 * @returns {boolean} 是否已配置
 */
function isLLMConfigured() {
  const config = configManager.getConfig();
  const provider = config.llm.provider;
  return provider && configManager.hasAPIKey(provider);
}

module.exports = {
  callLLMAPI,
  analyzeText,
  getSupportedProviders,
  isLLMConfigured
};