import React, {useMemo} from 'react';

import BrowserSpeaker from '../../lib/BrowserSpeaker';

import WordsList from '../../components/WordsList';
import AddWord from '../../components/AddWord';
import VoiceSelector from '../../components/VoiceSelector';

import { Link } from 'react-router-dom';

function EnglishHome({words, setWords, voice, setVoice, dictionary}) {
  const speaker = useMemo(() => new BrowserSpeaker(voice, 'en'), [voice]);

  // Add a word to the list
  function addWord(word) {
    const newWord = word.trim();
    if (newWord !== '') setWords([...words, newWord]);
  }

  // Remove a word from the list
  function removeWord(index) {
    const newWords = [...words];
    newWords.splice(index, 1);
    setWords(newWords);
  }

  // Archive the words of the week
  function archiveWords() {
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
        speaker={speaker}
        hideTranslation={true}
      />

      <AddWord
        lang="en"
        addWord={addWord}
        dictionary={dictionary}
        speaker={speaker}
      />

      <div className="tools">
        <div className="tool">
          <button onClick={archiveWords} className="pure-button">Archive</button>
          <Link to="training" className="pure-button">Train</Link>
        </div>
      </div>

      <VoiceSelector
        currentVoice={voice}
        setCurrentVoice={setVoice}
      />
    </div>
  );
}

export default EnglishHome;
