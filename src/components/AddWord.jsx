import React, { useState } from 'react';

import './AddWord.css'

function AddWord({ lang, addWord, dictionary }) {
  // Define state for keeping new word, word suggestions and translations
  const [newWord, setNewWord] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [newWordTranslations, setNewWordTranslations] = useState('');

  function newWordChanged(event) {
    newWordUpdated(event.target.value);
  }

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

  // Handle new word form submission
  function addWordSubmit(event) {
    event.preventDefault();
    const newWord = event.target.elements[0].value;
    addWord(newWord);
    newWordUpdated('');
  }

  // Render suggestions list
  function renderSuggestions() {
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

  function renderNewWordTranslations() {
    return (
      <div className="new-word-translations">
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

  function renderFeedback() {
    if (newWordTranslations.length > 0) return renderNewWordTranslations();
    if (suggestions.length > 0) return renderSuggestions();
    return '';
  }

  const inputPlaceholder = lang === "french" ? "Add a French word..." : "Add an English word...";
  const inputLang = lang === "french" ? "fr" : "en";

  return (
    <div className="add-word">
      <form onSubmit={addWordSubmit}>
        <input
          id="newWord"
          type="text"
          value={newWord}
          placeholder={inputPlaceholder}
          lang={inputLang}
          spellCheck={false}
          onChange={newWordChanged}
          autoCorrect="off"
        />
        <div className="word-feedback">
          {renderFeedback()}
        </div>

        <button type="submit" className="pure-button">Add</button>
      </form>
    </div>
  )
}

export default AddWord;
