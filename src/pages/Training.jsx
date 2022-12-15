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
        <div class="description">
          Listen to the word carefully and try to remember how to spell it.<br/>
          <ul>
            <li>Click "Repeat" to hear the word again.</li>
            <li>Click "Next" to move to the next word.</li>
            <li>Click "Finish" to terminate the training session.</li>
          </ul>
        </div>
        <div class="progress">Words left: {trainingWords.length}</div>
        <div class="tools">
          <div class="tool">
            <button onClick={repeatClicked} class="pure-button">Repeat</button>
          </div>

          <div class="tool">
            <button onClick={nextClicked} class="pure-button">Next</button>
          </div>

          <div class="tool">
            <Link to='/words-of-the-week' class="pure-button">Finish</Link>
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
        <div class="tools">
          <div class="tool">
            <button onClick={retryClicked} class="pure-button">Retry</button>
          </div>

          <div class="tool">
            <Link to='/words-of-the-week' class="pure-button">Finish</Link>
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
