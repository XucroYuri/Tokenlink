// analysis.js
function tokenize(text) {
  // 使用正则表达式去除标点符号并将文本转换为小写
  const cleanedText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
  
  // 使用空格分割文本
  return cleanedText.split(/\s+/).filter(Boolean); // 确保没有空字符串
}

function generateNgrams(tokens, n) {
  if (n <= 1) return tokens;
  
  const ngrams = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
}

function removeStopWords(tokens, stopWords) {
  return tokens.filter(token => !stopWords.includes(token));
}

function calculateWordFrequency(tokens) {
  const wordCounts = {};
  tokens.forEach(token => {
    wordCounts[token] = (wordCounts[token] || 0) + 1;
  });

  // 转换为数组并排序
  const wordFrequency = Object.keys(wordCounts).map(text => ({
    text: text,
    count: wordCounts[text]
  }));
  
  wordFrequency.sort((a, b) => b.count - a.count);
  return wordFrequency;
}

function calculateAssociations(tokens, focusTerms, windowSize) {
  const associations = focusTerms.map(term => {
    const termAssociations = {};
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === term) {
        for (let j = Math.max(0, i - windowSize); j <= Math.min(tokens.length - 1, i + windowSize); j++) {
          if (i !== j) {
            const neighbor = tokens[j];
            termAssociations[neighbor] = (termAssociations[neighbor] || 0) + 1;
          }
        }
      }
    }

    // 将关联词转换为数组并计算评分
    const associationList = Object.keys(termAssociations).map(text => ({
      text: text,
      score: termAssociations[text]
    }));

    // 按照评分排序并取前 N 个关联词
    associationList.sort((a, b) => b.score - a.score);
    return {
      term: term,
      associations: associationList.slice(0, 10) // 取前 10 个
    };
  });

  return associations;
}

module.exports = {
  tokenize,
  generateNgrams,
  removeStopWords,
  calculateWordFrequency,
  calculateAssociations
};
