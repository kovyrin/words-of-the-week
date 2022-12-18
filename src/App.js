import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, {useState, useEffect} from 'react';

import Dictionary from './Dictionary';

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Training from "./pages/Training";

import './App.css';

const dictionary = new Dictionary();

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/words-of-the-week" element={<Layout />}>
          <Route index element={
            <Home words={words} setWords={setWords} voice={voice} setVoice={setVoice} dictionary={dictionary} />
          } />
          <Route path="training" element={
            <Training words={words} voice={voice} setVoice={setVoice} dictionary={dictionary} />
          } />
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/words-of-the-week" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
