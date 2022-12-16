import React from 'react';

import './WordsList.css';

function WordsList({ words, removeWord, dictionary, speaker }) {
  // Handle say word button click
  const sayWordClick = (event) => {
    const index = event.target.closest('.word').dataset.index;
    speaker.say(words[index]);
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
