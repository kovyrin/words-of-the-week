import React, { useState, useEffect } from 'react';

import WordsList from '../components/WordsList';
import AddWord from '../components/AddWord';

import './Home.css';
import Dictionary from '../Dictionary';

function Home() {
  const dictionary = new Dictionary();

  // Define state for storing words of the week
  const [words, setWords] = useState(() => {
    const localData = localStorage.getItem('words');
    return localData ? JSON.parse(localData) : [];
  })

  // When the words state changes, update localStorage
  useEffect(() => {
    localStorage.setItem('words', JSON.stringify(words));
  }, [words]);

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

  return (
    <div>
      <div className="App-header">
        Words of the Week
      </div>

      <WordsList
        words={words}
        removeWord={removeWord}
        dictionary={dictionary}
      />

      <AddWord
        addWord={addWord}
        dictionary={dictionary}
      />

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
