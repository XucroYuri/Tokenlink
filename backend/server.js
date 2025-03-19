const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const analysis = require('./analysis');
const utils = require('./utils');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/analyze', (req, res) => {
  try {
    const { text, language, focusTerms, ngramSize, customStopWords, windowSize, minFrequency } = req.body;

    // 1. 分割文本为句子
    const sentences = utils.splitTextIntoSentences(text);

    // 2. 分词
    let tokens = [];
    sentences.forEach(sentence => {
      tokens = tokens.concat(analysis.tokenize(sentence));
    });

    // 3. 移除停用词
    const stopWords = customStopWords || [];
    tokens = analysis.removeStopWords(tokens, stopWords);

    // 4. 计算词频
    const wordFrequency = analysis.calculateWordFrequency(tokens);

    // 5. 计算语义关联
    const associations = analysis.calculateAssociations(tokens, focusTerms, windowSize);

    res.json({
      tokenCount: tokens.length,
      wordFrequency: wordFrequency,
      associations: associations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during analysis.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
