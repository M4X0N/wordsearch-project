import React, {useState} from 'react';
import '../css/Search.css';
import "bootstrap-icons/font/bootstrap-icons.css";

function SearchResults({data}) {
    const dataLimit = 2
    const [pages] = useState(Math.ceil(data.length/dataLimit));
    const [currentPage, setCurrentPage] = useState(1);

    function goToNextPage() {
        if (currentPage < pages ) {setCurrentPage(currentPage + 1)}
    }

    function goToPreviousPage() {
        if (currentPage > 1 ) {setCurrentPage(currentPage - 1)};
    }

    function changePage(event) {
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
    }

    function goToLast() {
        setCurrentPage(pages);
    }

    function goToFirst() {
        setCurrentPage(1);
    }
    const getPaginatedData = () => {
        const startIndex = currentPage * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        return data.slice(startIndex, endIndex);
    };

    return (
        <div className="mt-3">
        <div className="card">
            <div className="card-header">
                עמוד {currentPage}
            </div>
            <div className="card-body">
                <div className="dataContainer">
                    {getPaginatedData().map((d, idx) => (
                    <p className="form-text">{d}</p>
                    ))}
                </div>
            </div>
        </div>
        <div className="pagination justify-content-center mt-2">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className="page-item">
                    <a className="page-link" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span onClick={goToPreviousPage}
                        className={`prev`} disabled> הקודם </span>
                    </a>
                </li>
                { currentPage != 1 ?  <li className="page-item"><a className="page-link" onClick={goToFirst}>...</a></li>:''}
                { currentPage > 2 ?  <li className="page-item"><a className="page-link" onClick={changePage}>{currentPage-2}</a></li>:''}
                { currentPage > 1 ?  <li className="page-item"><a className="page-link" onClick={changePage}>{currentPage-1}</a></li>:''}
                <li className="page-item"><a className="page-link fw-bold" onClick={changePage}>{currentPage}</a></li>
                { currentPage < pages ?  <li className="page-item"><a className="page-link" onClick={changePage}>{currentPage+1}</a></li>:''}
                { currentPage+1 < pages ?  <li className="page-item"><a className="page-link" onClick={changePage}>{currentPage+2}</a></li>:''}
                { currentPage != pages ?  <li className="page-item"><a className="page-link" onClick={goToLast}>...</a></li>:''}
                <li className="page-item">
                    <a className="page-link"  aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span onClick={goToNextPage}
                        className={`next ${currentPage === pages ? 'disabled' : ''}`}> הבא </span>
                    </a>
                </li>
            </ul>
        </nav>
        </div>
      </div>)};

export default SearchResults;