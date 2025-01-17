import { useContext } from 'react';

import SearchContext from '../contexts/SearchContext';
import LanguageContext from "../contexts/LanguageContext"

import '../css/BasicSearch.css';

function BasicSearch(props) {
  const { searchData, setSearchData } = useContext(SearchContext);
  const data = useContext(LanguageContext).data.basic_search

  const changeSearch = (event) => {
    setSearchData({ ...searchData, basicSearch: { phrase: event.target.value }});
  }

  return (
    <div className="search collapse show mb-3" id="basicSearch" data-bs-parent="#accordion">
      <div className="input-group mb-3">
        <input value={ searchData.basicSearch.phrase } onChange={changeSearch} type="text" placeholder={data.search_here} className="form-control form-control-lg" id="basic-search-input" aria-describedby="searchHelp"/>
        <div className="input-group-append">
          <button className="btn btn-lg btn-outline-secondary" type="button">
          <i className="bi bi-search"></i>
          </button>
        </div>
        <div className="invalid-feedback">{data.invalid_feedback}</div>
      </div>
      <div id="searchHelp" className="form-text">{data.search_help}</div>
    </div>
  );
}

export default BasicSearch;