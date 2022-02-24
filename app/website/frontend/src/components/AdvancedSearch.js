import { useState } from "react";

import '../css/AdvancedSearch.css';

import WordItem from "./WordItem";

function AdvancedSearch() {
  const [words, setWords] = useState([[{'abc':'abc'},{'cbd':'cbd'}],[{'abc':'abc'},{'cbd':'cbd'}]])

  return (
    <div className="search collapse mb-3" id="advancedSearch" data-bs-parent="#accordion">
      {
        words.map((wordRow) => {
          return (
            <div class="row mb-3">
              {wordRow.map((word) => {
                return(<WordItem></WordItem>)
              })}
            </div>
          )
        })
      }
    </div>
  );
}

export default AdvancedSearch;
