import React from "react";

import './VoiceSelector.css';

function VoiceSelector({currentVoice, setCurrentVoice}) {
  function selectedVoiceChanged(event) {
    setCurrentVoice(event.target.value);
  }

  return (
    <div className="voice-selector">
      <label htmlFor="voice-select">Voice:</label>
      <select id="voice-select" onChange={selectedVoiceChanged} value={currentVoice}>
        <option value='female'>Female</option>
        <option value='male'>Male</option>
      </select>
    </div>
  )
}

export default VoiceSelector;
