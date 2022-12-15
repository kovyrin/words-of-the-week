import frenchDict from './fra-eng.json';

  // Articles, etc we do not want to consider during lookup
const removeWords = [
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'd\'', 'l\'', 'se',
];

// Removes accents from a word
function removeAccents(word) {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Build a lookup table from words without accets to words in the dictionary
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
  normalizeWord(word) {
    word = word.trim().toLowerCase();

    // Remove words
    removeWords.forEach(removeWord => {
      word = word.replace(new RegExp(`^${removeWord} `), '');
    });

    return word;
  }

  translate(word) {
    if (word === "" || word === undefined || word === null) {
      return [];
    }

    // Strip article, etc
    const cleanWord = this.normalizeWord(word);
    const translations = frenchDict[cleanWord];
    console.log("translations for", cleanWord, ":", translations);
    return translations || [];
  }

  suggest(word) {
    return noAccentLookup[word] || [];
  }
}

export default Dictionary;
