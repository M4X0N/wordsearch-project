import { useContext } from 'react';

import SearchContext from '../SearchContext';

import '../css/BasicSearch.css';

function BasicSearch(props) {
  const { searchData, setSearchData } = useContext(SearchContext);

  const changeSearch = (event) => {
    setSearchData({ ...searchData, basicSearch: { phrase: event.target.value }});
  }

  return (
    <div className="search collapse show mb-3" id="basicSearch" data-bs-parent="#accordion">
      <div className="input-group mb-3">
        <input value={ searchData.basicSearch.phrase } onChange={changeSearch} type="text" placeholder="חפש כאן" className="form-control form-control-lg" id="basic-search-input" aria-describedby="searchHelp" required/>
        <div className="input-group-append">
          <button className="btn btn-lg btn-outline-secondary" type="button">
          <i className="bi bi-search"></i>
          </button>
        </div>
        <div className="invalid-feedback">אנא הזן ביטוי לחיפוש</div>
      </div>
      <div id="searchHelp" className="form-text">הזן מילה ונמצא עבורך את המשפטים שהיא מופיעה בה</div>
    </div>
  );
}

export default BasicSearch;