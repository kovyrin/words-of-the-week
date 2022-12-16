import React from 'react';

import Dictionary from '../Dictionary';

import WordsList from '../components/WordsList';
import AddWord from '../components/AddWord';
import VoiceSelector from '../components/VoiceSelector';

import './Home.css';
import { Link } from 'react-router-dom';

function Home({words, setWords, voice, setVoice}) {
  const dictionary = new Dictionary();

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
      <WordsList
        words={words}
        removeWord={removeWord}
        dictionary={dictionary}
        voice={voice}
      />

      <AddWord
        addWord={addWord}
        dictionary={dictionary}
      />

      <div className="tools">
        <div className="tool">
          <button onClick={archiveWords} className="pure-button">Archive</button>
          <Link to="/words-of-the-week/training" className="pure-button">Train</Link>
        </div>
      </div>

      <VoiceSelector
        currentVoice={voice}
        setCurrentVoice={setVoice}
      />
    </div>
  );
}

export default Home;
