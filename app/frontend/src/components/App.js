import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";

import '../css/App.css';

import Search from './Search';
import SentenceFinder from "./SentenceFinder";
import FileUpload from "./FileUpload";
import Navbar from "./Navbar";
import LanguageContext from "../contexts/LanguageContext";
const localization = require('../localization.json')
axios.defaults.baseURL = `http://localhost:5000`; 
//axios.defaults.baseURL = `http://backend`; // Containerized should work


function App() {
  // const data = useContext(LanguageContext).data.app
  const [data, setData] = useState(localization.english);
  const value = { data, setData };
  return (
    <>
    <Router>
    <LanguageContext.Provider value={value} >
      <div dir={data.dir}>
      <Navbar></Navbar>
      <div className="app container"> 
          <Routes>
            <Route path="/" element={<SentenceFinder></SentenceFinder>}></Route>
            <Route path="/search" element={<Search></Search>}></Route>
            <Route path="/sentence-finder" element={<SentenceFinder></SentenceFinder>}></Route>
            <Route path="/lexicon-upload" element={<FileUpload filePurpose={data.app.lexicon_keyword} acceptedTypes=".txt"></FileUpload>}></Route>
            <Route path="/text-upload" element={<FileUpload filePurpose={data.app.text_keyword} acceptedTypes=".txt,.docx"></FileUpload>}></Route>
            <Route path="*" element={<Search></Search>}></Route>
          </Routes>
      </div>
      </div>
    </LanguageContext.Provider>
    </Router>
    </>
  );
}

export default App;
