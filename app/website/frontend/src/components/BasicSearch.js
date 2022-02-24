import '../css/BasicSearch.css';

function BasicSearch(props) {
  return (
    <div className="search collapse show mb-3" id="basicSearch" data-bs-parent="#accordion">
      <div class="input-group mb-3">
        <input type="text" placeholder="חפש כאן" class="form-control form-control-lg" id="basic-search-input" aria-describedby="searchHelp"/>
        <div class="input-group-append">
          <button class="btn btn-lg btn-outline-secondary" type="button">
          <i class="bi bi-search"></i>
          </button>
        </div>
      </div>
      <div id="searchHelp" class="form-text">הזן מילה ונמצא עבורך את המשפטים שהיא מופיעה בה</div>
    </div>
  );
}

export default BasicSearch;
