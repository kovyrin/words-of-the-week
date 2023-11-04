import React, {useMemo} from 'react';

import BrowserSpeaker from '../../lib/BrowserSpeaker';

import WordsList from '../../components/WordsList';
import AddWord from '../../components/AddWord';
import VoiceSelector from '../../components/VoiceSelector';

import { Link } from 'react-router-dom';

function FrenchHome({words, setWords, voice, setVoice, dictionary}) {
  const speaker = useMemo(() => new BrowserSpeaker(voice, 'fr'), [voice]);

  // Add a word to the list
  function addWord(word) {
    const newWord = word.trim();
    if (newWord !== '') setWords([...words, newWord]);
  }

  // Archive the words of the week
  async function archiveWords() {
    if (!window.confirm("Are you sure you want to archive the words of the week?")) {
      return;
    }

    // Delete caches for all words before archiving them
    await Promise.all(words.map(async word => await speaker.deleteCacheFor(word)));

    // Move the words to the archive and clear the list
    let archive = JSON.parse(localStorage.getItem('wordsArchive')) || [];
    archive = [...archive, ...words];
    localStorage.setItem('wordsArchive', JSON.stringify(archive));
    setWords([]);
  }

  return (
    <div>
      <WordsList
        words={words}
        setWords={setWords}
        dictionary={dictionary}
        speaker={speaker}
        hideTranslation={false}
      />

      <AddWord
        lang="fr"
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

export default FrenchHome;
