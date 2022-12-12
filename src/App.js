import React, { useState, useEffect } from 'react';

import './App.css';
import frenchDict from './apertium-fra-eng.fra-eng.json';

function App() {
  const speech = window.speechSynthesis;

  // Removes accents from a word
  function removeAccents(word) {
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function normalizeWord(word) {
    return word.trim().toLowerCase().split(/[^A-zÀ-ú]/).pop();
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

  // Custom speech rate overrides for different voices
  const speechRateOverrides = {
    'Thomas': 0.8
  }

  // Define state for keeping new word, word suggestions and translations
  const [newWord, setNewWord] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [newWordTranslations, setNewWordTranslations] = useState('');

  // Define state for storing words of the week
  const [words, setWords] = useState(() => {
    const localData = localStorage.getItem('words');
    return localData ? JSON.parse(localData).sort() : [];
  })

  // When the words state changes, update localStorage
  useEffect(() => {
    localStorage.setItem('words', JSON.stringify(words));
  }, [words]);

  // When the new word changes, update suggestions and translations
  function updateNewWord(word) {
    setNewWord(word);

    word = normalizeWord(word);
    if (word === "") {
      console.log("empty word");
      setSuggestions([]);
      setNewWordTranslations([]);
      return;
    }

    console.log("looking up translations for", word)
    const translations = translate(word);
    setNewWordTranslations(translations);

    if (translations.length > 0) {
      console.log("found translations");
      setSuggestions([]);
      return;
    }

    const wordSuggestions = noAccentLookup[word] || [];
    if (wordSuggestions.length === 0) {
      console.log("no suggestions");
      setSuggestions([]);
      return;
    }

    console.log("found suggestions");
    setSuggestions(wordSuggestions);
  }

  // Add a word to the list
  const addWord = (word) => {
    const newWord = word.trim();
    if (newWord !== '') {
      setWords([...words, newWord].sort());
    }
  }

  // Remove a word from the list
  const removeWord = (index) => {
    const newWords = [...words];
    newWords.splice(index, 1);
    setWords(newWords);
  }

  // Populate the voice selector with available voices
  const populateVoices = () => {
    const voiceSelect = document.getElementById('voiceSelect');
    voiceSelect.innerHTML = '';

    const voices = speech.getVoices();
    const frenchVoices = voices.filter(voice => voice.lang === 'fr-FR');
    frenchVoices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.voiceURI;
      option.innerHTML = voice.name;
      voiceSelect.appendChild(option);
    });

    const thomasVoice = frenchVoices.find(voice => voice.name === 'Thomas');
    if (thomasVoice) {
      voiceSelect.value = thomasVoice.voiceURI;
    }
  }

  // When the SpeechSynthesis object is ready, populate the voice selector
  speech.onvoiceschanged = populateVoices;

  // Populate the list of voices when the page loads
  useEffect(populateVoices);

  // Handle new word form submission
  const addWordSubmit = (event) => {
    event.preventDefault();
    const newWord = event.target.elements[0].value;
    addWord(newWord);
    updateNewWord('');
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

  // Translate a word using Apertium
  const translate = (word) => {
    if (word === "" || word === undefined || word === null) {
      console.log("empty word");
      return [];
    }

    // Strip article, etc
    const cleanWord = normalizeWord(word);
    const translations = frenchDict[cleanWord];
    console.log("translations for", cleanWord, ":", translations);
    return translations || [];
  }

  // Handle say word button click
  const sayWordClick = (event) => {
    const index = event.target.closest('.word').dataset.index;
    const word = words[index];
    const voiceURI = document.getElementById('voiceSelect').value;
    const frenchVoice = speech.getVoices().find(voice => voice.voiceURI === voiceURI);
    const message = new SpeechSynthesisUtterance(word);
    message.voice = frenchVoice;
    message.rate = speechRateOverrides[frenchVoice.name] || 1;
    speech.speak(message);
  }

  const newWordChanged = (event) => {
    updateNewWord(event.target.value);
  }

  // Render suggestions list
  const renderSuggestions = () => {
    return (
      <div className="suggestions">
        Did you mean:
        {
          suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion" onClick={() => updateNewWord(suggestion)}>
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
    <div className="App">
      <div className="App-header">
        Words of the Week
        <div className="App-subheader">
        {Object.keys(frenchDict).length} words in the dictionary
      </div>
      </div>
      <div className="words">
        {
          words.map((word, index) => (
            <div className="word" key={index} data-index={index}>
              <div className='word-info' onClick={sayWordClick}>
                <div className="word-text">{word}</div>
                <div className="word-translation">
                  {
                    translate(word).map((translation, index) => (
                      <div key={index}>{translation}</div>
                    ))
                  }
                </div>
              </div>
              <div className="word-delete" onClick={deleteWordClick}>🗑️</div>
            </div>
          ))
        }
      </div>
      <div className="word-feedback">
        {renderFeedback()}
      </div>
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
          <button type="submit">Add</button>
        </form>
      </div>
      <div className="voiceSelector">
        <label htmlFor="voiceSelect">Voice:</label>
        <select id="voiceSelect"></select>
      </div>
    </div>
  );
}

export default App;
