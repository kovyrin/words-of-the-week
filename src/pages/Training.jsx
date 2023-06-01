import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import VoiceSelector from '../components/VoiceSelector';
import FrenchSpeaker from '../FrenchSpeaker';

import './Training.css';

function Training({words, voice, setVoice, dictionary}) {
  const speaker = useMemo(() => new FrenchSpeaker(voice), [voice]);

  // State for keeping the list of words to train
  const [previousTrainingWords, setPreviousTrainingWords] = React.useState([]);
  const [remainingTrainingWords, setRemainingTrainingWords] = React.useState([]);
  const [allTrainingWords, setAllTrainingWords] = React.useState([]);
  const [trainingStarted, setTrainingStarted] = React.useState(false);


  // Play the first word when the training starts
  useEffect(() => {
    const currentWord = remainingTrainingWords[0];
    if (trainingStarted && currentWord)
      speaker.say(currentWord);
  }, [trainingStarted, voice, speaker, remainingTrainingWords]);

  function getCurrentWord() {
    return remainingTrainingWords[0];
  }

  function repeatClicked() {
    speaker.say(getCurrentWord());
  }

  function nextClicked() {
    const previousTrainingWordsCopy = [...previousTrainingWords];
    previousTrainingWordsCopy.push(getCurrentWord());
    setPreviousTrainingWords(previousTrainingWordsCopy);

    const newTrainingWords = [...remainingTrainingWords];
    newTrainingWords.shift();
    setRemainingTrainingWords(newTrainingWords);
  }

  function backClicked() {
    const previousTrainingWordsCopy = [...previousTrainingWords];
    const lastWord = previousTrainingWordsCopy.pop();
    setPreviousTrainingWords(previousTrainingWordsCopy);

    const newTrainingWords = [...remainingTrainingWords];
    newTrainingWords.unshift(lastWord);
    setRemainingTrainingWords(newTrainingWords);
  }

  function finishClicked() {
    setRemainingTrainingWords([]);
    setTrainingStarted(false);
  }

  function renderTrainingWord() {
    return (
      <div className="training">
        <div className="description">
          <div className="title">Word {remainingTrainingWords.length} of {allTrainingWords.length}</div>
        </div>

        <div className="wordInfo">
          {
            dictionary.translate(getCurrentWord()).map((translation, index) => (
              <div key={index} className="translation">{translation}</div>
            ))
          }
        </div>

        <div className="tools">
        <div className="tool">
            <button onClick={backClicked} className="pure-button">Back</button>
          </div>

          <div className="tool">
            <button onClick={repeatClicked} className="pure-button">Repeat</button>
          </div>

          <div className="tool">
            <button onClick={nextClicked} className="pure-button">Next</button>
          </div>

          <div className="tool">
            <button onClick={finishClicked} className="pure-button">Finish</button>
          </div>
        </div>
      </div>
    );
  }

  function retryClicked() {
    setRemainingTrainingWords(allTrainingWords);
  }

  function startTraining(words) {
    if (words.length > 20) {
      words = words.sort(() => Math.random() - 0.5).slice(0, 20);
    }
    words = words.sort(() => Math.random() - 0.5); // Shuffle the words
    setAllTrainingWords(words);
    setRemainingTrainingWords(words);
    setTrainingStarted(true);
    setPreviousTrainingWords([]);
  }

  function startTrainingTop(n) {
    const topWords = dictionary.top(n);
    startTraining(topWords);
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

  function renderTraining() {
    return (remainingTrainingWords.length === 0 ? renderComplete() : renderTrainingWord());
  }

  function renderOptions() {
    return (
      <div>
        <div className="description">
          Start a training session and practice a set of up to 20 French words.<br/>
          Listen to each word carefully and try to remember how to spell it and what it means.<br/>
          You can train on the words from this week or from a random set of popular French words.
        </div>

        <ul className="trainingOptions">
          <li><button className="pure-button" onClick={() => startTraining(words)}>Words of the Week</button></li>
          <li>
            <button className="pure-button" onClick={() => startTrainingTop(100)}>Top-100</button>
          </li>
          <li>
            <button className="pure-button" onClick={() => startTrainingTop(1000)}>Top-1000</button>
          </li>
          <li>
            <button className="pure-button" onClick={() => startTrainingTop(5000)}>Top-5000</button>
          </li>
          <li>
            <Link className="pure-button" to="/words-of-the-week/">Back</Link>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h1>Training</h1>

      { trainingStarted ? renderTraining() : renderOptions() }

      <VoiceSelector
        currentVoice={voice}
        setCurrentVoice={setVoice}
      />
    </div>
  );
}

export default Training;
