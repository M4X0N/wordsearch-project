import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import '../css/App.css';

import Search from './Search';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Search></Search>}></Route>
          <Route path="/search" element={<Search></Search>}></Route>
          <Route path="*" element={<Search></Search>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;