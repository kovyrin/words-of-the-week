import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, {useState, useEffect} from 'react';

import './App.css';

import FrenchDictionary from './lib/FrenchDictionary';
import EnglishDictionary from './lib/EnglishDictionary';

import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";

import AppSelector from "./pages/AppSelector";

import FrenchHome from "./pages/french/Home";
import Training from "./pages/Training";

import EnglishHome from "./pages/english/Home";

const frenchDictionary = new FrenchDictionary();
const englishDictionary = new EnglishDictionary();

function App() {
  // Define state for storing current selected voice for Web Speech API
  const [voice, setVoice] = useState(null);

  // Define state for storing French words of the week
  const [frenchWords, setFrenchWords] = useState(() => {
    // This is to support the old name of the localStorage key
    const localData = localStorage.getItem('french_words') || localStorage.getItem('words');
    return localData ? JSON.parse(localData) : [];
  })

  // Define state for storing English words of the week
  const [englishWords, setEnglishWords] = useState(() => {
    const localData = localStorage.getItem('english_words');
    return localData ? JSON.parse(localData) : [];
  })

  // When the French words state changes, update localStorage
  useEffect(() => {
    localStorage.setItem('french_words', JSON.stringify(frenchWords));
  }, [frenchWords]);

  // Same for English words
  useEffect(() => {
    localStorage.setItem('english_words', JSON.stringify(englishWords));
  }, [englishWords]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/words-of-the-week" element={<Layout />}>
          <Route index element={<AppSelector />} />
          <Route path="english">
            <Route index element={
              <EnglishHome words={englishWords} setWords={setEnglishWords} voice={voice} setVoice={setVoice} dictionary={englishDictionary} />
            } />
            <Route path="training" element={
              <Training lang="english" words={englishWords} voice={voice} setVoice={setVoice} dictionary={englishDictionary} />
            } />
          </Route>

          <Route path="french">
            <Route index element={
              <FrenchHome words={frenchWords} setWords={setFrenchWords} voice={voice} setVoice={setVoice} dictionary={frenchDictionary} />
            } />
            <Route path="training" element={
              <Training lang="french" words={frenchWords} voice={voice} setVoice={setVoice} dictionary={frenchDictionary} />
            } />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/words-of-the-week" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
