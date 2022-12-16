import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import VoiceSelector from '../components/VoiceSelector';

import './Training.css';

function playWord(word, voice) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function Training({words, voice, setVoice}) {
  // State for keeping the list of words to train
  const [trainingWords, setTrainingWords] = React.useState(words);
  const [trainingStarted, setTrainingStarted] = React.useState(false);

  // Initialize with the current week's list of words
  useEffect(() => {
    // Shuffle the words from this week and set them as the training words
    setTrainingWords(words.sort(() => Math.random() - 0.5));
    setTrainingStarted(true);
  }, [words]);

  // Play the first word when the training starts
  useEffect(() => {
    if (trainingStarted) {
      playWord(trainingWords[0], voice);
    }
  }, [trainingStarted, voice, trainingWords]);

  function repeatClicked() {
    playWord(trainingWords[0], voice);
  }

  function nextClicked() {
    const newTrainingWords = [...trainingWords];
    newTrainingWords.shift();
    setTrainingWords(newTrainingWords);
  }

  function renderTraining() {
    return (
      <div className="training">
        <div className="description">
          Listen to the word carefully and try to remember how to spell it.<br/>
          <ul>
            <li>Click "Repeat" to hear the word again.</li>
            <li>Click "Next" to move to the next word.</li>
            <li>Click "Finish" to terminate the training session.</li>
          </ul>
        </div>
        <div className="progress">Words left: {trainingWords.length}</div>
        <div className="tools">
          <div className="tool">
            <button onClick={repeatClicked} className="pure-button">Repeat</button>
          </div>

          <div className="tool">
            <button onClick={nextClicked} className="pure-button">Next</button>
          </div>

          <div className="tool">
            <Link to='/words-of-the-week' className="pure-button">Finish</Link>
          </div>
        </div>
      </div>
    );
  }

  function retryClicked() {
    setTrainingWords(words);
  }

  function renderComplete() {
    return (
      <div className="training">
        <div>Training complete!</div>
        <div className="tools">
          <div className="tool">
            <button onClick={retryClicked} className="pure-button">Retry</button>
          </div>

          <div className="tool">
            <Link to='/words-of-the-week' className="pure-button">Finish</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Training</h1>

      {trainingWords.length === 0 ? renderComplete() : renderTraining()}

      <VoiceSelector
        currentVoice={voice}
        setCurrentVoice={setVoice}
      />
    </div>
  );
}

export default Training;
