import englishWords from '../data/english.json';
import topWords from '../data/english-top-5000.json';

class FrenchDictionary {
  constructor() {
    this.englishWords = englishWords;
    this.topWords = topWords;
  }

  top(n) {
    return this.topWords.slice(0, n);
  }

  normalizeWord(word) {
    return word.trim().toLowerCase();
  }

  translate(_word) {
    return [];
  }

  suggest(word) {
    return this.englishWords.filter(englishWord => {
      return englishWord.toLowerCase().startsWith(word.toLowerCase()) && englishWord !== word;
    }).slice(0, 10);
  }
}

export default FrenchDictionary;
