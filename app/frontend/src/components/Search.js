import { useState } from 'react';

import '../css/Search.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import BasicSearch from './BasicSearch';
import AdvancedSearch from './AdvancedSearch';
import Loading from './Loading';

function Search() {
  const [advanced, setAdvanced] = useState(false);

  const toggleAdvanced = () => {
    setAdvanced(!advanced)
  }

  const search = (event) => {
    event.preventDefault();
  }

  return (
    <div className="mt-3">
        <form>
            <p class="display-3 text-center">חיפוש</p>
            <div class="accordion" id="accordion">
            <BasicSearch></BasicSearch>
            <AdvancedSearch></AdvancedSearch>
            </div>
            <div class="d-flex justify-content-between">
            <button type="submit" onClick={search} class="btn btn-success" data-bs-toggle="modal" data-bs-target="#searchLoading">חפש</button>
            <button type="button" onClick={toggleAdvanced} data-bs-toggle="collapse" data-bs-target=".search" class={`btn ${advanced ? "btn-info" : "btn-danger"}`} aria-expanded="false" aria-controls="basicSearch advancedSearch">{advanced ? "חיפוש בסיסי" : "חיפוש מתקדם"}</button>
            </div>
        </form>
        <Loading message="החיפוש מתבצע כעת..." id="searchLoading"></Loading>
    </div>
  );
}

export default Search;
