import frenchDict from './fra-eng.json';
import topWords from './top-5000.json';

  // Articles, etc we do not want to consider during lookup
const removeWords = [
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'se'
];

// Prefixes we do not want to consider during lookup
const removePrefixes = [
  'd\'', 'l\'', 's\''
]

// Removes accents from a word
function removeAccents(word) {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Build a lookup table from words without accents to words in the dictionary
// Each no-accent word can map into multiple dictionary words
const noAccentLookup = {};
Object.keys(frenchDict).forEach(word => {
  const noAccent = removeAccents(word);
  if (!noAccentLookup[noAccent]) {
    noAccentLookup[noAccent] = [];
  }
  noAccentLookup[noAccent].push(word);
});

class Dictionary {
  constructor() {
    this.topWords = topWords;
  }

  top(n) {
    return this.topWords.slice(0, n);
  }

  normalizeWord(word) {
    word = word.trim().toLowerCase();

    // Remove words
    removeWords.forEach(removeWord => {
      word = word.replace(new RegExp(`^${removeWord} `), '');
    });

    // Remove prefixes
    removePrefixes.forEach(removePrefix => {
      word = word.replace(new RegExp(`^${removePrefix}`), '');
    });

    return word;
  }

  translate(word) {
    if (word === "" || word === undefined || word === null) return [];

    // Check the word/phrase as is
    if (frenchDict[word]) return frenchDict[word];

    // Strip article, etc and re-check
    const cleanWord = this.normalizeWord(word);
    return frenchDict[cleanWord] || [];
  }

  suggest(word) {
    return noAccentLookup[word] || [];
  }
}

export default Dictionary;
