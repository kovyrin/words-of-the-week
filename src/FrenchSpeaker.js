// Custom speech rate overrides for different voices
const speechRateOverrides = {
  'Thomas': 0.8
}

class FrenchSpeaker {
  constructor() {
    this.voice = null;
    this.speech = window.speechSynthesis;
  }

  setVoice(voice) {
    this.voice = voice;
  }

  say(word) {
    word = word.replace('-', ' '); // SpeechSynthesis in Chrome doesn't like hyphens (stops speaking)
    const message = new SpeechSynthesisUtterance(word);
    message.voice = this.voice;
    message.rate = speechRateOverrides[this.voice.name] || 1;
    this.speech.speak(message);
  }
}

export default FrenchSpeaker;
