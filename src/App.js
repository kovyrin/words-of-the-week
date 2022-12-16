import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, {useState, useEffect} from 'react';

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";

import './App.css';
import Training from "./pages/Training";
import FrenchSpeaker from "./FrenchSpeaker";

const speaker = new FrenchSpeaker();

function App() {
  // Define state for storing current selected voice for Web Speech API
  const [voice, setVoice] = useState(null);

  // Define state for storing words of the week
  const [words, setWords] = useState(() => {
    const localData = localStorage.getItem('words');
    return localData ? JSON.parse(localData) : [];
  })

  // When the words state changes, update localStorage
  useEffect(() => {
    localStorage.setItem('words', JSON.stringify(words));
  }, [words]);

  // When the voice changes, update the speaker
  useEffect(() => {
    speaker.setVoice(voice);
  }, [voice]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/words-of-the-week" element={<Layout />}>
          <Route index element={
            <Home words={words} setWords={setWords} speaker={speaker} voice={voice} setVoice={setVoice} />
          } />
          <Route path="training" element={
            <Training words={words} speaker={speaker} voice={voice} setVoice={setVoice} />
          } />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
