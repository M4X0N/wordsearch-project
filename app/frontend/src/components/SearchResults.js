import { useEffect, useState } from 'react';

import '../css/Search.css';
import "bootstrap-icons/font/bootstrap-icons.css";

function SearchResults(props) {
    const dataLimit = 13;
    const [pages, setPages] = useState(Math.ceil(props.data.length / dataLimit));
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setPages(Math.ceil(props.data.length / dataLimit));
        setCurrentPage(1);
    }, [props.data])

    const goToNextPage = () => {
        if (currentPage < pages) { setCurrentPage(currentPage + 1) }
    }

    const goToPreviousPage = () => {
        if (currentPage > 1) { setCurrentPage(currentPage - 1) };
    }

    const changePage = (event) => {
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
    }

    const goToLast = () => {
        setCurrentPage(pages);
    }

    const goToFirst = () => {
        setCurrentPage(1);
    }

    const getPaginatedData = () => {
        const startIndex = currentPage * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        return props.data.slice(startIndex, endIndex);
    };

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    עמוד {currentPage}
                </div>
                <div className="card-body">
                    <div className="dataContainer">
                        {getPaginatedData().map((data, index) => (
                            <p className="form-text" key={index}>{data}</p>
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
                        {currentPage != 1 ? <li className="page-item"><a className="page-link" onClick={goToFirst}>...</a></li> : ''}
                        {currentPage > 2 ? <li className="page-item"><a className="page-link" onClick={changePage}>{currentPage - 2}</a></li> : ''}
                        {currentPage > 1 ? <li className="page-item"><a className="page-link" onClick={changePage}>{currentPage - 1}</a></li> : ''}
                        <li className="page-item"><a className="page-link fw-bold" onClick={changePage}>{currentPage}</a></li>
                        {currentPage < pages ? <li className="page-item"><a className="page-link" onClick={changePage}>{currentPage + 1}</a></li> : ''}
                        {currentPage + 1 < pages ? <li className="page-item"><a className="page-link" onClick={changePage}>{currentPage + 2}</a></li> : ''}
                        {currentPage != pages ? <li className="page-item"><a className="page-link" onClick={goToLast}>...</a></li> : ''}
                        <li className="page-item">
                            <a className="page-link" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                                <span onClick={goToNextPage}
                                    className={`next ${currentPage === pages ? 'disabled' : ''}`}> הבא </span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>)
};

export default SearchResults;