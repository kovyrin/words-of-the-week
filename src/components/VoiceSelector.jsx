import React, {useEffect, useState} from "react";

import './VoiceSelector.css';

const preferredVoicesForLang = {
  "french": [
    'Google français',
    'Thomas',
  ],
  "english": [
    'Google US English',
    'Samantha',
  ],
};

const speech = window.speechSynthesis;

function VoiceSelector({lang, currentVoice, setCurrentVoice}) {
  // State for storing available voices
  const [voices, setVoices] = useState([]);

  // Populate the voice selector with available voices
  function populateVoices() {
    const systemVoices = speech.getVoices();
    const langVoices = systemVoices.filter((voice) => {
      if (lang === 'english') {
        return voice.lang.startsWith('en');
      } else if (lang === 'french') {
        return voice.lang === 'fr-FR';
      } else {
        return false;
      }
    });

    setVoices(langVoices);

    if (currentVoice == null || !langVoices.includes(currentVoice)) {
      const preferredVoices = preferredVoicesForLang[lang] || [];
      const selectedVoice = langVoices.find(voice => preferredVoices.includes(voice.name));
      if (selectedVoice != null) {
        setCurrentVoice(selectedVoice);
      } else {
        setCurrentVoice(langVoices[0]);
      }
    }
  }

  // Populate the list of voices when the page loads (needed for Safari)
  useEffect(populateVoices, [lang, currentVoice, setCurrentVoice, setVoices]);

  // When the SpeechSynthesis object is ready (does not work in Safari), update the list of available voices
  speech.onvoiceschanged = populateVoices;

  function selectedVoiceChanged(event) {
    const voiceURI = event.target.value;
    const voice = voices.find(voice => voice.voiceURI === voiceURI);
    setCurrentVoice(voice);
  }

  return (
    <div className="voice-selector">
      <label htmlFor="voice-select">Voice:</label>
      <select id="voice-select" onChange={selectedVoiceChanged} value={currentVoice?.voiceURI}>
        {
          voices.map((voice, index) => (
            <option key={index} value={voice.voiceURI}>{voice.name}</option>
          ))
        }
      </select>
    </div>
  )
}

export default VoiceSelector;
