import React, { useState, useEffect } from 'react';

import './App.css';

function App() {
  const speech = window.speechSynthesis;

  // Custom speech rate overrides for different voices
  const speechRateOverrides = {
    'Thomas': 0.8
  }

  // Define state for storing words of the week
  const [words, setWords] = useState(() => {
    const localData = localStorage.getItem('words');
    return localData ? JSON.parse(localData).sort() : [];
  })

  // When the words state changes, update localStorage
  useEffect(() => {
    localStorage.setItem('words', JSON.stringify(words));
  }, [words]);

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
    event.target.reset();
  }

  // Handle delete word button click
  const deleteWordClick = (event) => {
    const index = event.target.parentNode.getAttribute('data-index');
    const word = words[index];
    // make sure they want to delete the word
    if (!window.confirm(`Are you sure you want to delete "${word}"?`)) {
      return;
    }
    removeWord(index);
  }

  // Handle say word button click
  const sayWordClick = (event) => {
    const index = event.target.parentNode.getAttribute('data-index');
    const word = words[index];
    const voiceURI = document.getElementById('voiceSelect').value;
    const frenchVoice = speech.getVoices().find(voice => voice.voiceURI === voiceURI);
    console.log(frenchVoice);
    const message = new SpeechSynthesisUtterance(word);
    message.voice = frenchVoice;
    message.rate = speechRateOverrides[frenchVoice.name] || 1;
    speech.speak(message);
  }

  return (
    <div className="App">
      <div className="App-header">
        Words of the Week
      </div>
      <div className="words">
        {
          words.map((word, index) => (
            <div className="word" key={index} data-index={index}>
              <div className="word-text" onClick={sayWordClick}>{word}</div>
              <div className="word-delete" onClick={deleteWordClick}>🗑️</div>
            </div>
          ))
        }
      </div>
      <div className="add-word">
        <form onSubmit={addWordSubmit}>
          <input type="text" placeholder="New word" lang="fr" spellCheck={false} autoCorrect="off"></input>
          <button type="submit">Add</button>
        </form>
      </div>
      <div className="voiceSelector">
        <select id="voiceSelect"></select>
      </div>
    </div>
  );
}

export default App;
