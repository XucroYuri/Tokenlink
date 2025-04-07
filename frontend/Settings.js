/**
 * 设置组件 - 用于配置大语言模型API
 * Settings Component - For configuring Large Language Model API
 */

export default class Settings {
    constructor() {
        this.isOpen = false;
        this.currentProvider = 'deepseek'; // 默认使用DeepSeek
        this.supportedProviders = ['deepseek', 'openai'];
        this.configuredProviders = [];
        this.isConfigured = false;
        
        this.init();
    }
    
    /**
     * 初始化设置组件
     * Initialize settings component
     */
    init() {
        // 创建设置按钮
        this.createSettingsButton();
        
        // 创建设置菜单
        this.createSettingsMenu();
        
        // 获取当前配置
        this.fetchCurrentConfig();
    }
    
    /**
     * 创建设置按钮
     * Create settings button
     */
    createSettingsButton() {
        // 创建设置按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'fixed top-4 right-4';
        
        // 创建设置按钮
        const settingsButton = document.createElement('button');
        settingsButton.className = 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full flex items-center';
        settingsButton.innerHTML = '<i data-lucide="settings" class="w-5 h-5"></i>';
        settingsButton.title = '设置 / Settings';
        
        // 添加点击事件
        settingsButton.addEventListener('click', () => this.toggleSettings());
        
        // 将按钮添加到容器
        buttonContainer.appendChild(settingsButton);
        
        // 将容器添加到页面
        document.body.appendChild(buttonContainer);
        
        // 初始化Lucide图标
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
    
    /**
     * 创建设置菜单
     * Create settings menu
     */
    createSettingsMenu() {
        // 创建设置菜单容器
        const menuContainer = document.createElement('div');
        menuContainer.id = 'settingsMenu';
        menuContainer.className = 'fixed top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-80 hidden';
        
        // 创建设置菜单标题
        const menuTitle = document.createElement('h3');
        menuTitle.className = 'text-lg font-bold mb-4 flex justify-between items-center';
        menuTitle.innerHTML = '大语言模型设置 <span class="text-sm font-normal">LLM Settings</span>';
        
        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.className = 'text-gray-500 hover:text-gray-700';
        closeButton.innerHTML = '<i data-lucide="x" class="w-5 h-5"></i>';
        closeButton.addEventListener('click', () => this.toggleSettings(false));
        
        menuTitle.appendChild(closeButton);
        
        // 创建设置表单
        const settingsForm = document.createElement('form');
        settingsForm.id = 'apiSettingsForm';
        settingsForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // 创建提供商选择
        const providerLabel = document.createElement('label');
        providerLabel.className = 'block text-gray-700 text-sm font-bold mb-2';
        providerLabel.textContent = '选择提供商 / Select Provider';
        
        const providerSelect = document.createElement('select');
        providerSelect.id = 'providerSelect';
        providerSelect.className = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4';
        
        // 添加提供商选项
        this.supportedProviders.forEach(provider => {
            const option = document.createElement('option');
            option.value = provider;
            option.textContent = provider === 'deepseek' ? 'DeepSeek AI' : 'OpenAI';
            providerSelect.appendChild(option);
        });
        
        // 创建API密钥输入
        const apiKeyLabel = document.createElement('label');
        apiKeyLabel.className = 'block text-gray-700 text-sm font-bold mb-2';
        apiKeyLabel.textContent = 'API密钥 / API Key';
        
        const apiKeyInput = document.createElement('input');
        apiKeyInput.id = 'apiKeyInput';
        apiKeyInput.type = 'password';
        apiKeyInput.className = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4';
        apiKeyInput.placeholder = '输入您的API密钥 / Enter your API key';
        apiKeyInput.required = true;
        
        // 创建提交按钮
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full';
        submitButton.textContent = '保存设置 / Save Settings';
        
        // 创建状态信息
        const statusInfo = document.createElement('div');
        statusInfo.id = 'apiStatusInfo';
        statusInfo.className = 'mt-4 text-sm';
        
        // 将元素添加到表单
        settingsForm.appendChild(providerLabel);
        settingsForm.appendChild(providerSelect);
        settingsForm.appendChild(apiKeyLabel);
        settingsForm.appendChild(apiKeyInput);
        settingsForm.appendChild(submitButton);
        
        // 将元素添加到菜单容器
        menuContainer.appendChild(menuTitle);
        menuContainer.appendChild(settingsForm);
        menuContainer.appendChild(statusInfo);
        
        // 将菜单容器添加到页面
        document.body.appendChild(menuContainer);
    }
    
    /**
     * 切换设置菜单显示状态
     * Toggle settings menu display state
     * @param {boolean} [force] - 强制设置状态 (force state)
     */
    toggleSettings(force) {
        this.isOpen = force !== undefined ? force : !this.isOpen;
        const menu = document.getElementById('settingsMenu');
        
        if (this.isOpen) {
            menu.classList.remove('hidden');
        } else {
            menu.classList.add('hidden');
        }
    }
    
    /**
     * 获取当前配置
     * Fetch current configuration
     */
    async fetchCurrentConfig() {
        try {
            const response = await fetch('/api/config/llm');
            if (!response.ok) {
                throw new Error('Failed to fetch configuration');
            }
            
            const data = await response.json();
            
            this.currentProvider = data.currentProvider;
            this.configuredProviders = data.configuredProviders;
            this.supportedProviders = data.supportedProviders;
            this.isConfigured = data.isConfigured;
            
            // 更新UI
            this.updateUI();
        } catch (error) {
            console.error('Error fetching configuration:', error);
            this.showStatus('无法获取配置信息 / Failed to fetch configuration', 'error');
        }
    }
    
    /**
     * 更新UI
     * Update UI
     */
    updateUI() {
        // 更新提供商选择
        const providerSelect = document.getElementById('providerSelect');
        if (providerSelect) {
            providerSelect.value = this.currentProvider;
        }
        
        // 更新状态信息
        if (this.isConfigured) {
            this.showStatus(
                `已配置 ${this.currentProvider} API / ${this.currentProvider} API configured`,
                'success'
            );
        } else {
            this.showStatus(
                '未配置API / API not configured',
                'warning'
            );
        }
    }
    
    /**
     * 显示状态信息
     * Show status information
     * @param {string} message - 消息 (message)
     * @param {string} type - 类型 (type): success, error, warning, info
     */
    showStatus(message, type = 'info') {
        const statusInfo = document.getElementById('apiStatusInfo');
        if (!statusInfo) return;
        
        // 设置类名
        statusInfo.className = 'mt-4 text-sm';
        
        // 根据类型设置颜色
        switch (type) {
            case 'success':
                statusInfo.classList.add('text-green-600');
                break;
            case 'error':
                statusInfo.classList.add('text-red-600');
                break;
            case 'warning':
                statusInfo.classList.add('text-yellow-600');
                break;
            default:
                statusInfo.classList.add('text-gray-600');
        }
        
        // 设置消息
        statusInfo.textContent = message;
    }
    
    /**
     * 处理表单提交
     * Handle form submission
     * @param {Event} e - 事件对象 (event object)
     */
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const provider = document.getElementById('providerSelect').value;
        const apiKey = document.getElementById('apiKeyInput').value;
        
        if (!provider || !apiKey) {
            this.showStatus('请填写所有字段 / Please fill in all fields', 'error');
            return;
        }
        
        // 显示加载状态
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = '保存中... / Saving...';
        submitButton.disabled = true;
        
        try {
            // 设置API密钥
            await this.setAPIKey(provider, apiKey);
            
            // 设置提供商
            await this.setProvider(provider);
            
            // 测试连接
            await this.testConnection(provider);
            
            // 清空API密钥输入
            document.getElementById('apiKeyInput').value = '';
            
            // 更新状态
            this.isConfigured = true;
            this.currentProvider = provider;
            if (!this.configuredProviders.includes(provider)) {
                this.configuredProviders.push(provider);
            }
            
            // 更新UI
            this.updateUI();
            
            // 显示成功消息
            this.showStatus('设置已保存 / Settings saved', 'success');
            
            // 3秒后关闭设置菜单
            setTimeout(() => this.toggleSettings(false), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showStatus(`保存设置失败: ${error.message} / Failed to save settings: ${error.message}`, 'error');
        } finally {
            // 恢复按钮状态
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    }
    
    /**
     * 设置API密钥
     * Set API key
     * @param {string} provider - 提供商 (provider)
     * @param {string} apiKey - API密钥 (API key)
     */
    async setAPIKey(provider, apiKey) {
        const response = await fetch('/api/config/llm/apikey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ provider, apiKey })
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to set API key');
        }
        
        return await response.json();
    }
    
    /**
     * 设置提供商
     * Set provider
     * @param {string} provider - 提供商 (provider)
     */
    async setProvider(provider) {
        const response = await fetch('/api/config/llm/provider', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ provider })
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to set provider');
        }
        
        return await response.json();
    }
    
    /**
     * 测试连接
     * Test connection
     * @param {string} provider - 提供商 (provider)
     */
    async testConnection(provider) {
        const response = await fetch('/api/config/llm/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ provider })
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Connection test failed');
        }
        
        return await response.json();
    }
}