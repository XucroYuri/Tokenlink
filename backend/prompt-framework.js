/**
 * Prompt 框架服务 - 为不同类型的文本分析任务提供结构化的 prompt 模板
 */
const fs = require('fs');
const path = require('path');

// Prompt 模板集合
const PROMPT_TEMPLATES = {
  // 语义分析模板
  semanticAnalysis: `
你是一个专业的语义分析专家。请对以下文本进行多维度的语义分析：

文本内容：{{TEXT}}

请从以下几个维度进行分析：
1. 核心主题：识别文本的主要主题和子主题
2. 关键概念：提取文本中的关键概念及其关系
3. 情感倾向：分析文本的整体情感倾向（积极、消极或中性）
4. 语义关联：分析主要概念之间的语义关联
5. 隐含信息：识别文本中可能隐含但未明确表达的信息

输出格式要求：
{
  "coreThemes": [{"name": "主题名称", "weight": 0.95, "description": "主题描述"}],
  "keyConcepts": [{"name": "概念名称", "frequency": 5, "importance": 0.85}],
  "sentimentAnalysis": {"overall": "积极/消极/中性", "score": 0.75, "details": "详细分析"},
  "semanticRelations": [{"source": "概念A", "target": "概念B", "relation": "关系描述", "strength": 0.8}],
  "impliedInformation": ["隐含信息1", "隐含信息2"]
}

请确保分析深入且客观，并严格按照上述JSON格式输出结果。
`,

  // 文本摘要模板
  textSummarization: `
你是一个专业的文本摘要专家。请对以下文本进行多层次摘要：

文本内容：{{TEXT}}

请提供以下三种长度的摘要：
1. 简短摘要（50字以内）
2. 中等摘要（150字以内）
3. 详细摘要（300字以内）

同时，请提取文本中的5-10个关键词，按重要性排序。

输出格式要求：
{
  "shortSummary": "简短摘要内容",
  "mediumSummary": "中等摘要内容",
  "detailedSummary": "详细摘要内容",
  "keywords": [
    {"word": "关键词1", "importance": 0.95},
    {"word": "关键词2", "importance": 0.85}
  ]
}

请确保摘要准确反映原文内容，并严格按照上述JSON格式输出结果。
`,

  // 概念关联分析模板
  conceptAssociation: `
你是一个专业的概念关联分析专家。请分析以下文本中的概念关联：

文本内容：{{TEXT}}

焦点概念：{{FOCUS_CONCEPTS}}

请执行以下分析：
1. 识别与焦点概念直接相关的所有概念
2. 分析这些概念之间的关联强度和关系类型
3. 构建一个概念关联网络
4. 提供每个关联的上下文证据

输出格式要求：
{
  "focusConcepts": ["概念1", "概念2"],
  "relatedConcepts": [
    {
      "name": "相关概念名称",
      "associations": [
        {
          "targetConcept": "目标概念",
          "relationStrength": 0.85,
          "relationType": "因果/组成部分/对比/等同/...",
          "evidence": "文本中的证据"
        }
      ]
    }
  ],
  "conceptNetwork": {
    "nodes": [{"id": "概念ID", "name": "概念名称", "type": "focus/related", "weight": 0.75}],
    "edges": [{"source": "源概念ID", "target": "目标概念ID", "weight": 0.8, "type": "关系类型"}]
  }
}

请确保分析深入且客观，并严格按照上述JSON格式输出结果。
`,

  // 文本分类模板
  textClassification: `
你是一个专业的文本分类专家。请对以下文本进行分类：

文本内容：{{TEXT}}

分类体系：{{CLASSIFICATION_SYSTEM}}

请执行以下分析：
1. 确定文本属于哪些类别（可多选）
2. 为每个类别提供置信度分数
3. 提供分类依据

输出格式要求：
{
  "classifications": [
    {
      "category": "类别名称",
      "confidence": 0.85,
      "evidence": "分类依据"
    }
  ],
  "dominantCategory": "主导类别",
  "confidenceDistribution": [{"category": "类别名称", "confidence": 0.85}]
}

请确保分类准确客观，并严格按照上述JSON格式输出结果。
`
};

/**
 * 获取指定类型的prompt模板
 * @param {string} type - 模板类型
 * @returns {string} prompt模板
 */
function getPromptTemplate(type) {
  if (!PROMPT_TEMPLATES[type]) {
    throw new Error(`未找到类型为 "${type}" 的prompt模板`);
  }
  return PROMPT_TEMPLATES[type];
}

/**
 * 填充prompt模板中的占位符
 * @param {string} template - prompt模板
 * @param {Object} variables - 要填充的变量
 * @returns {string} 填充后的prompt
 */
function fillPromptTemplate(template, variables) {
  let filledPrompt = template;
  
  // 替换所有占位符
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    filledPrompt = filledPrompt.replace(new RegExp(placeholder, 'g'), value);
  }
  
  return filledPrompt;
}

/**
 * 生成完整的prompt
 * @param {string} type - 分析类型
 * @param {Object} variables - 要填充的变量
 * @returns {string} 完整的prompt
 */
function generatePrompt(type, variables) {
  const template = getPromptTemplate(type);
  return fillPromptTemplate(template, variables);
}

module.exports = {
  getPromptTemplate,
  fillPromptTemplate,
  generatePrompt,
  PROMPT_TEMPLATES
};