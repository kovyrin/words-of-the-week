// Custom speech rate overrides for different voices
const speechRateOverrides = {
  'Thomas': 0.8,
  'Samantha': 0.8
}

class BrowserSpeaker {
  constructor(voice) {
    this.voice = voice;
    this.speech = window.speechSynthesis;
  }

  say(word) {
    if (!this.voice) return;
    word = word.replace('-', ' '); // SpeechSynthesis in Chrome doesn't like hyphens (stops speaking)
    const message = new SpeechSynthesisUtterance(word);
    message.voice = this.voice;
    message.rate = speechRateOverrides[this.voice.name] || 1;
    this.speech.speak(message);
  }
}

export default BrowserSpeaker;
