const express = require('express');
const router = express.Router();
const analysis = require('./analysis');

// 分析文本
router.post('/analyze', async (req, res) => {
  try {
    const { text, focusTerms, ngramSize, stopWords, windowSize, minFrequency } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: '文本不能为空' });
    }
    
    // 执行分析
    const tokens = analysis.tokenize(text);
    const filteredTokens = analysis.removeStopWords(tokens, stopWords || []);
    const wordFrequency = analysis.calculateWordFrequency(filteredTokens);
    const associations = analysis.calculateAssociations(
      filteredTokens, 
      focusTerms || [], 
      windowSize || 5
    );
    
    res.json({
      tokens: filteredTokens,
      wordFrequency,
      associations
    });
  } catch (error) {
    console.error('分析失败:', error);
    res.status(500).json({ error: `分析失败: ${error.message}` });
  }
});

module.exports = router;