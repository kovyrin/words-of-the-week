const ttsPassword = 'Iewee1ohshaiNgeekadeiYue7fu4Oot5';
const ttsUrl = 'https://us-central1-words-of-the-week.cloudfunctions.net/tts?password=' + ttsPassword;

class BrowserSpeaker {
  constructor(voice, lang) {
    this.voice = voice;
    this.lang = lang;
    this.ttsUrl = ttsUrl + '&language=' + lang + '&gender=' + voice;
  }

  say(word) {
    let ttsUrl = this.ttsUrl + '&text=' + word;
    let audio = new Audio(ttsUrl);
    audio.playbackRate = 0.9;
    audio.play();
  }
}

export default BrowserSpeaker;
