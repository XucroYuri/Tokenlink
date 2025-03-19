const analysis = require('./analysis');

describe('analysis.js', () => {
  describe('tokenize', () => {
    it('should correctly tokenize a simple sentence', () => {
      const text = 'This is a simple sentence.';
      const tokens = analysis.tokenize(text);
      expect(tokens).toEqual(['this', 'is', 'a', 'simple', 'sentence']);
    });

    it('should handle punctuation correctly', () => {
      const text = 'Hello, world!';
      const tokens = analysis.tokenize(text);
      expect(tokens).toEqual(['hello', 'world']);
    });
  });

  describe('removeStopWords', () => {
    it('should remove stop words from a list of tokens', () => {
      const tokens = ['this', 'is', 'a', 'test'];
      const stopWords = ['is', 'a'];
      const filteredTokens = analysis.removeStopWords(tokens, stopWords);
      expect(filteredTokens).toEqual(['this', 'test']);
    });
  });

  describe('calculateWordFrequency', () => {
    it('should correctly calculate word frequency', () => {
      const tokens = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
      const wordFrequency = analysis.calculateWordFrequency(tokens);
      expect(wordFrequency).toEqual([
        { text: 'apple', count: 3 },
        { text: 'banana', count: 2 },
        { text: 'orange', count: 1 },
      ]);
    });
  });

  describe('calculateAssociations', () => {
    it('should calculate associations for a specific term', () => {
      const tokens = ['spirituality', 'is', 'a', 'concept', 'of', 'connecting', 'with', 'something', 'larger', 'than', 'oneself'];
      const focusTerms = ['spirituality'];
      const windowSize = 3;
      const associations = analysis.calculateAssociations(tokens, focusTerms, windowSize);
      expect(associations).toEqual([
        {
          term: 'spirituality',
          associations: [
            { text: 'is', score: expect.any(Number) },
            { text: 'a', score: expect.any(Number) },
            { text: 'concept', score: expect.any(Number) },
          ],
        },
      ]);
    });
  });
});
