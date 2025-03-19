function splitTextIntoSentences(text) {
    // 使用正则表达式分割文本为句子
    const sentences = text.split(/[.?!]/).filter(sentence => sentence.trim() !== "");
    return sentences.map(sentence => sentence.trim());
}

function detectLanguage(text) {
    // 简单的语言检测
    const englishRegex = /[a-zA-Z]/;
    const chineseRegex = /[\u4e00-\u9fa5]/;

    if (englishRegex.test(text)) {
        return 'en';
    } else if (chineseRegex.test(text)) {
        return 'zh';
    } else {
        return 'unknown';
    }
}

module.exports = {
    splitTextIntoSentences,
    detectLanguage
};
