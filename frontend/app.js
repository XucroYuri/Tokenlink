// 导入可视化函数和设置组件
import { renderWordFrequencyChart, renderWordCloud } from './visualization.js';
import Settings from './Settings.js';

document.addEventListener('DOMContentLoaded', () => {
    // 初始化 Lucide 图标
    lucide.createIcons();
    
    // 初始化设置组件
    const settings = new Settings();
    
    // 获取表单元素
    const form = document.getElementById('analysisForm');
    const resultsSection = document.getElementById('resultsSection');
    
    // 添加表单提交事件监听器
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 显示加载状态
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="animate-spin mr-2">↻</span> 分析中...';
        submitButton.disabled = true;
        
        try {
            // 获取表单数据
            const textInput = document.getElementById('textInput').value;
            const focusTermsInput = document.getElementById('focusTermsInput').value;
            const ngramSizeInput = document.getElementById('ngramSize').value;
            const customStopWordsInput = document.getElementById('customStopWords').value;
            const windowSizeInput = document.getElementById('windowSize').value;
            const minFrequencyInput = document.getElementById('minFrequency').value;
            
            // 处理焦点词
            const focusTerms = focusTermsInput.split(',').map(term => term.trim().toLowerCase());
            
            // 处理自定义停用词
            const customStopWords = customStopWordsInput ? customStopWordsInput.split(',').map(word => word.trim().toLowerCase()) : [];
            
            // 准备请求数据
            const requestData = {
                text: textInput,
                focusTerms: focusTerms,
                ngramSize: parseInt(ngramSizeInput),
                customStopWords: customStopWords,
                windowSize: parseInt(windowSizeInput),
                minFrequency: parseInt(minFrequencyInput)
            };
            
            // 发送分析请求
            const response = await fetch('/api/analysis/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                throw new Error('分析请求失败');
            }
            
            const data = await response.json();
            
            // 显示结果
            displayResults(data);
            
            // 显示结果部分
            resultsSection.classList.remove('hidden');
            
            // 滚动到结果部分
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('分析过程中出错:', error);
            alert('分析过程中出错: ' + error.message);
        } finally {
            // 恢复按钮状态
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });
    
    // 显示分析结果
    function displayResults(data) {
        // 显示 Token 数量
        document.getElementById('tokenCount').textContent = data.tokenCount;
        
        // 渲染词频图表
        renderWordFrequencyChart(data.wordFrequency);
        
        // 渲染词云
        renderWordCloud(data.wordFrequency);
        
        // 显示语义关联
        displayAssociations(data.associations);
    }
    
    // 显示语义关联
    function displayAssociations(associations) {
        const associationsContainer = document.getElementById('associationsContainer');
        associationsContainer.innerHTML = '';
        
        associations.forEach(item => {
            const termDiv = document.createElement('div');
            termDiv.className = 'mb-4 p-4 bg-white rounded shadow';
            
            const termTitle = document.createElement('h3');
            termTitle.className = 'text-lg font-bold mb-2';
            termTitle.textContent = `关联词: ${item.term}`;
            termDiv.appendChild(termTitle);
            
            const associationsList = document.createElement('ul');
            associationsList.className = 'list-disc pl-5';
            
            item.associations.forEach(assoc => {
                const listItem = document.createElement('li');
                listItem.textContent = `${assoc.text} (得分: ${assoc.score})`;
                associationsList.appendChild(listItem);
            });
            
            termDiv.appendChild(associationsList);
            associationsContainer.appendChild(termDiv);
        });
    }
});

// 添加全局错误处理函数
function handleApiError(error, message) {
  console.error(message, error);
  
  // 显示错误消息给用户
  const errorContainer = document.getElementById('error-container');
  if (errorContainer) {
    errorContainer.textContent = `${message}: ${error.message || '未知错误'}`;
    errorContainer.style.display = 'block';
    
    // 5秒后自动隐藏
    setTimeout(() => {
      errorContainer.style.display = 'none';
    }, 5000);
  }
}

// 修改API调用函数，添加错误处理
async function analyzeText(text, focusTerms, options = {}) {
  try {
    const response = await fetch('/api/analysis/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        focusTerms,
        ...options
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `服务器返回错误: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error, '文本分析失败');
    throw error;
  }
}
