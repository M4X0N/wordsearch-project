import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import '../css/App.css';

import Search from './Search';
import SentenceFinder from "./SentenceFinder";
import FileUpload from "./FileUpload";
import Navbar from "./Navbar";

axios.defaults.baseURL = `http://localhost:5000`;

function App() {
  return (
    <>
    <Router>
      <Navbar></Navbar>
      <div className="app container">
        <Routes>
          <Route path="/" element={<SentenceFinder></SentenceFinder>}></Route>
          <Route path="/search" element={<Search></Search>}></Route>
          <Route path="/sentence-finder" element={<SentenceFinder></SentenceFinder>}></Route>
          <Route path="/lexicon-upload" element={<FileUpload filePurpose="לקסיקון" acceptedTypes=".txt"></FileUpload>}></Route>
          <Route path="/text-upload" element={<FileUpload filePurpose="טקסט" acceptedTypes=".txt,.docx"></FileUpload>}></Route>
          <Route path="*" element={<Search></Search>}></Route>
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;