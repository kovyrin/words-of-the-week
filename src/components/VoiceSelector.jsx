import React, {useEffect, useState} from "react";

import './VoiceSelector.css';

const preferredVoices = [
  'Google français',
  'Thomas',
];

const speech = window.speechSynthesis;

function VoiceSelector({currentVoice, setCurrentVoice}) {
  // State for storing available voices
  const [voices, setVoices] = useState([]);

  // Populate the voice selector with available voices
  const populateVoices = () => {
    const systemVoices = speech.getVoices();
    const frenchVoices = systemVoices.filter(voice => voice.lang === 'fr-FR');
    setVoices(frenchVoices);

    if (currentVoice == null) {
      const selectedVoice = frenchVoices.find(voice => preferredVoices.includes(voice.name));
      if (selectedVoice != null) {
        setCurrentVoice(selectedVoice);
      } else {
        setCurrentVoice(frenchVoices[0]);
      }
    }
  }

  // Populate the list of voices when the page loads (needed for Safari)
  useEffect(populateVoices, [currentVoice, setCurrentVoice, setVoices]);

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
