const app = require('./app');

describe('app.js', () => {
  describe('fetchData', () => {
    it('should correctly fetch data from the API', async () => {
      // Mock the fetch function
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ tokenCount: 100 }),
        })
      );

      const data = await app.fetchData('test text');
      expect(data.tokenCount).toBe(100);
      expect(fetch).toHaveBeenCalledWith('/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'test text',
          language: 'auto',
          focusTerms: [],
          ngramSize: 1,
          customStopWords: [],
          windowSize: 5,
          minFrequency: 2,
        }),
      });
    });
  });

  describe('updateUI', () => {
    it('should correctly update the UI elements', () => {
      // Mock the document object
      document.getElementById = jest.fn(() => ({
        textContent: '',
      }));

      app.updateUI({ tokenCount: 100 });
      expect(document.getElementById).toHaveBeenCalledWith('token-count');
      expect(document.getElementById('token-count').textContent).toBe('100');
    });
  });
});
