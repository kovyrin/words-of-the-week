import React, { useState, useEffect } from 'react';

import WordsList from '../components/WordsList';

import './Home.css';
import Dictionary from '../Dictionary';

function Home() {
  const dictionary = new Dictionary();

  // Define state for keeping new word, word suggestions and translations
  const [newWord, setNewWord] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [newWordTranslations, setNewWordTranslations] = useState('');

  // Define state for storing words of the week
  const [words, setWords] = useState(() => {
    const localData = localStorage.getItem('words');
    return localData ? JSON.parse(localData) : [];
  })

  // When the words state changes, update localStorage
  useEffect(() => {
    localStorage.setItem('words', JSON.stringify(words));
  }, [words]);

  // When the new word changes, update suggestions and translations
  function newWordUpdated(word) {
    setNewWord(word);

    word = dictionary.normalizeWord(word);
    if (word === "") {
      setSuggestions([]);
      setNewWordTranslations([]);
      return;
    }

    const translations = dictionary.translate(word);
    setNewWordTranslations(translations);

    if (translations.length > 0) {
      setSuggestions([]);
      return;
    }

    const wordSuggestions = dictionary.suggest(word);
    if (wordSuggestions.length === 0) {
      setSuggestions([]);
      return;
    }

    setSuggestions(wordSuggestions);
  }

  // Add a word to the list
  const addWord = (word) => {
    const newWord = word.trim();
    if (newWord !== '') setWords([...words, newWord]);
  }

  // Remove a word from the list
  const removeWord = (index) => {
    const newWords = [...words];
    newWords.splice(index, 1);
    setWords(newWords);
  }

  // Handle new word form submission
  const addWordSubmit = (event) => {
    event.preventDefault();
    const newWord = event.target.elements[0].value;
    addWord(newWord);
    newWordUpdated('');
  }

  // Handle delete word button click
  const deleteWordClick = (event) => {
    const index = event.target.closest('.word').dataset.index;
    const word = words[index];
    // make sure they want to delete the word
    if (!window.confirm(`Are you sure you want to delete "${word}"?`)) {
      return;
    }
    removeWord(index);
  }

  const newWordChanged = (event) => {
    newWordUpdated(event.target.value);
  }

  // Archive the words of the week
  const archiveWords = () => {
    if (!window.confirm("Are you sure you want to archive the words of the week?")) {
      return;
    }

    let archive = JSON.parse(localStorage.getItem('wordsArchive')) || [];
    archive = [...archive, ...words];
    localStorage.setItem('wordsArchive', JSON.stringify(archive));
    setWords([]);
  }

  // Render suggestions list
  const renderSuggestions = () => {
    return (
      <div className="suggestions">
        Did you mean:
        {
          suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion" onClick={() => newWordUpdated(suggestion)}>
              {suggestion}
            </div>
          ))
        }
      </div>
    )
  }

  const renderNewWordTranslations = () => {
    console.log("newWordTranslations", newWordTranslations);
    return (
      <div className="translations">
        Translations: {
          newWordTranslations.map((translation, index) => (
            <div key={index} className="translation">
              {translation}
            </div>
          ))
        }
      </div>
    )
  }

  const renderFeedback = () => {
    if (newWordTranslations.length > 0) return renderNewWordTranslations();
    if (suggestions.length > 0) return renderSuggestions();
    return '';
  }

  return (
    <div>
      <div className="App-header">
        Words of the Week
      </div>

      <WordsList
        words={words}
        deleteWordClick={deleteWordClick}
        dictionary={dictionary}
      />

      <div className="add-word">
        <form onSubmit={addWordSubmit}>
          <input
            id="newWord"
            type="text"
            value={newWord}
            placeholder="Add a word..."
            lang="fr"
            spellCheck={false}
            onChange={newWordChanged}
            autoCorrect="off"
          />
          <div className="word-feedback">
            {renderFeedback()}
          </div>

          <button type="submit">Add</button>
        </form>
      </div>
      <div className="tools">
        <div className="tool">
          <button onClick={archiveWords}>Archive</button>
        </div>
      </div>
      <div className="voiceSelector">
        <label htmlFor="voiceSelect">Voice:</label>
        <select id="voiceSelect"></select>
      </div>
    </div>
  );
}

export default Home;
