import localForage from 'localforage';

// Change this to reset all cached keys
const ttsUrlVersion = '1.0';

// Secret password for the TTS service
const ttsPassword = 'Iewee1ohshaiNgeekadeiYue7fu4Oot5';
const ttsUrl = 'https://us-central1-words-of-the-week.cloudfunctions.net/tts?password=' + ttsPassword;

class BrowserSpeaker {
  constructor(voice, lang) {
    this.voice = voice;
    this.lang = lang;
    this.ttsUrl = ttsUrl + '&language=' + lang + '&gender=' + voice;
  }

  async preCache(word) {
    const audioUrl = this.ttsUrl + '&text=' + word;

    // Construct the key for IndexedDB and try to get the audio blob
    const dbKey = `mp3:${ttsUrlVersion}:${this.lang}:${this.voice}:${word}`;
    let audioBlob = await localForage.getItem(dbKey);

    // If the audio blob isn't cached, fetch and cache it
    if (!audioBlob) {
      const response = await fetch(audioUrl);
      audioBlob = await response.blob();
      await localForage.setItem(dbKey, audioBlob);
    }

    return audioBlob;
  }

  async say(word) {
    // Fetch the audio blob from the local cache or the TTS service
    const audioBlob = await this.preCache(word);

    // Play the audio
    const objectUrl = URL.createObjectURL(audioBlob);
    let audio = new Audio(objectUrl);
    audio.playbackRate = 0.9;
    audio.play();

    // Release the object URL if not needed anymore
    audio.onended = () => {
      URL.revokeObjectURL(objectUrl);
    };
  }
}

export default BrowserSpeaker;
