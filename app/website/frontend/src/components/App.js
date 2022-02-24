import { useState } from 'react';

import '../css/App.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import BasicSearch from './BasicSearch';
import AdvancedSearch from './AdvancedSearch';

function App() {
  const [advanced, setAdvanced] = useState(false);

  const toggleAdvanced = () => {
    setAdvanced(!advanced)
  }

  return (
    <div className="App">
      <div class="container mt-3">
        <form>
          <p class="display-4">חיפוש</p>
          <div class="accordion" id="accordion">
            <BasicSearch></BasicSearch>
            <AdvancedSearch></AdvancedSearch>
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-success">חפש</button>
            <button type="button" onClick={toggleAdvanced} data-bs-toggle="collapse" data-bs-target=".search" class={`btn ${advanced ? "btn-info" : "btn-danger"}`} aria-expanded="false" aria-controls="basicSearch advancedSearch">{advanced ? "חיפוש בסיסי" : "חיפוש מתקדם"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
