import React from 'react';

import './WordsList.css';

function WordsList({ words, removeWord, dictionary, voice }) {
  // Custom speech rate overrides for different voices
  const speechRateOverrides = {
    'Thomas': 0.8
  }

  // Web Speech API
  const speech = window.speechSynthesis;

  // Handle say word button click
  const sayWordClick = (event) => {
    const index = event.target.closest('.word').dataset.index;
    const word = words[index].replace('-', ' '); // SpeechSynthesis doesn't like hyphens (stops speaking)
    const message = new SpeechSynthesisUtterance(word);
    message.voice = voice;
    message.rate = speechRateOverrides[voice.name] || 1;
    speech.speak(message);
  }

  // Handle delete word button click
  const deleteWordClick = (event) => {
    if (!window.confirm("Are you sure you want to delete this word?")) {
      return;
    }
    const index = event.target.closest('.word').dataset.index;
    removeWord(index);
  }

  return (
    <div className="words">
    {
      words.map((word, index) => (
        <div className="word" key={index} data-index={index}>
          <div className='word-info' onClick={sayWordClick}>
            <div className="word-text">{word}</div>
            <div className="word-translation">
              {
                dictionary.translate(word).map((translation, index) => (
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
  );
}

export default WordsList;
