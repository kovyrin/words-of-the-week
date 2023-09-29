import frenchDict from '../data/fra-eng.json';
import topWords from '../data/french-top-5000.json';

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

class FrenchDictionary {
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

  // Singularize a given French word
  toSingular(noun) {
    const lowerNoun = noun.toLowerCase();
    const length = lowerNoun.length;

    if (length > 3 && lowerNoun.endsWith('aux')) {
      return noun.slice(0, -1) + 'l';
    } else if (length > 2 && lowerNoun.endsWith('s')) {
      if (lowerNoun.endsWith('ss')) {
        return noun; // Nouns ending in -ss, e.g., "fosses" remain unchanged in singular form
      } else {
        return noun.slice(0, -1);
      }
    } else if (length > 2 && lowerNoun.endsWith('x')) {
      if (lowerNoun.endsWith('oux')) {
        return noun.slice(0, -2) + 'u';
      } else {
        return noun.slice(0, -1);
      }
    } else {
      return noun;
    }
  }

  translate(word) {
    if (word === "" || word === undefined || word === null) return [];

    // Check the word/phrase as is
    if (frenchDict[word]) return frenchDict[word];

    // Strip article, etc and re-check
    const cleanWord = this.normalizeWord(word);
    if (frenchDict[cleanWord]) return frenchDict[cleanWord];

    // Try to singularize and re-check
    const singularWord = this.toSingular(cleanWord);
    if (frenchDict[singularWord]) {
      // "Add (plural) to the end of the translation
      return frenchDict[singularWord].map(translation => `${translation} (plural)`);
    }

    // No match
    return [];
  }

  suggest(word) {
    return noAccentLookup[word] || [];
  }
}

export default FrenchDictionary;
