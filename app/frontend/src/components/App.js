import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import '../css/App.css';

import Search from './Search';
import SentenceFinder from "./SentenceFinder";

axios.defaults.baseURL = `http://localhost:5000`;

function App() {
  return (
    <div className="app container">
      <Router>
        <Routes>
          <Route path="/" element={<SentenceFinder></SentenceFinder>}></Route>
          <Route path="/search" element={<Search></Search>}></Route>
          <Route path="/sentence-finder" element={<SentenceFinder></SentenceFinder>}></Route>
          <Route path="*" element={<Search></Search>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;