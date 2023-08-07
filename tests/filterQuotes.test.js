const { filterQuote } = require('../routes/interactions');

describe('filterQuote', () => {
  it('should remove special characters @ from a quote', () => {
    const quote = 'The quick brown fox jumps over the lazy dog@';
    const expected = 'The quick brown fox jumps over the lazy dog';
    const result = filterQuote(quote);
    expect(result).toEqual(expected);
  });

  it('should remove multiple @@@ from a quote', () => {
    const quote = 'The quick brown fox jumps over the lazy dog@@@';
    const expected = 'The quick brown fox jumps over the lazy dog';
    const result = filterQuote(quote);
    expect(result).toEqual(expected);
  });

  it('should remove special characters from a quote with backslashes', () => {
    const quote = 'C:\\Windows\\System32\\cmd.exe';
    const expected = 'C:WindowsSystem32cmd.exe';
    const result = filterQuote(quote);
    expect(result).toEqual(expected);
  });

  it('should remove special characters from an empty quote', () => {
    const quote = '';
    const expected = '';
    const result = filterQuote(quote);
    expect(result).toEqual(expected);
  });
});