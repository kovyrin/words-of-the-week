import React, { useEffect } from 'react';

function WordsList(props) {
  // Custom speech rate overrides for different voices
  const speechRateOverrides = {
    'Thomas': 0.8
  }

  // Web Speech API
  const speech = window.speechSynthesis;

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

  // Handle say word button click
  const sayWordClick = (event) => {
    const index = event.target.closest('.word').dataset.index;
    const word = props.words[index].replace('-', ' '); // SpeechSynthesis doesn't like hyphens (stops speaking)
    const voiceURI = document.getElementById('voiceSelect').value;
    const frenchVoice = speech.getVoices().find(voice => voice.voiceURI === voiceURI);
    const message = new SpeechSynthesisUtterance(word);
    message.voice = frenchVoice;
    message.rate = speechRateOverrides[frenchVoice.name] || 1;
    speech.speak(message);
  }


  return (
    <div className="words">
    {
      props.words.map((word, index) => (
        <div className="word" key={index} data-index={index}>
          <div className='word-info' onClick={sayWordClick}>
            <div className="word-text">{word}</div>
            <div className="word-translation">
              {
                props.dictionary.translate(word).map((translation, index) => (
                  <div key={index}>{translation}</div>
                ))
              }
            </div>
          </div>
          <div className="word-delete" onClick={props.deleteWordClick}>🗑️</div>
        </div>
      ))
    }
    </div>
  );
}

export default WordsList;
