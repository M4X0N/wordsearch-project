import { useState, useContext } from "react";

import '../css/AdvancedSearch.css';

import WordItem from "./WordItem";
import SearchContext from "./SearchContext";

function AdvancedSearch() {
  const { searchData, setSearchData } = useContext(SearchContext);

  // const [avgWordLengthCheckbox, setAvgWordLengthCheckbox] = useState(false);
  // const [avgWordLength, setAvgWordLength] = useState(0);

  // const [minWordsCheckbox, setMinWordsCheckbox] = useState(false);
  // const [minWords, setMinWords] = useState(0);

  const focusOnLast = () => {
    const numOfWordItems = document.getElementsByClassName('word-item').length;
    const lastWordItem = document.getElementsByClassName('word-item')[numOfWordItems - 1];
    lastWordItem.getElementsByTagName('input')[0].focus();
  }

  const changeWordOnIndex = (index, selector, newValue) => {
    const newWords = JSON.parse(JSON.stringify(searchData.advancedSearch.words));
    newWords[index] = { ...newWords[index], [selector]: newValue };

    return newWords;
  }

  const removeWordsAfterIndex = (index) => {
    // including the specified coordinate
    const newWords = JSON.parse(JSON.stringify(searchData.advancedSearch.words));

    if (index === 0) {
      return [{ word: '', length: '' }];
    }

    const lastIndex = newWords.length - 1;

    newWords.splice(index, lastIndex - index + 1);

    return newWords;
  }

  const addWord = async () => {
    const newWords = JSON.parse(JSON.stringify(searchData.advancedSearch.words));
    newWords.push({ word: '', length: '' })

    const newData = {...searchData};
    newData.advancedSearch.words = newWords;

    await setSearchData(newData);
    focusOnLast();
  }

  const changeWord = (index, selector, newValue) => {
    const newData = {...searchData};
    newData.advancedSearch.words = changeWordOnIndex(index, selector, newValue); 
    setSearchData(newData);
  }

  const removeWords = async (index) => {
    const newData = {...searchData};
    newData.advancedSearch.words = removeWordsAfterIndex(index)
    await setSearchData(newData);
    focusOnLast();
  }
  
  const handleParameterChange = (event) => {
    const inputId = event.target.id;
    let newValue;

    if (inputId.includes('Checkbox')) {
      newValue = event.target.checked; 
    } else {
      newValue = event.target.value;
    }

    const newData = {...searchData}

    switch (inputId) {
      // don't know why negation is necessary here
      case "avgWordLengthCheckbox":
        document.getElementById("avgWordLength").disabled = newValue ? false : true;

        if (newValue) {
          newData.advancedSearch.avgWordLength = 0;
          setSearchData(newData);
        }

        break;
      case "minWordsCheckbox":
        document.getElementById("minWords").disabled = newValue ? false : true;

        if (newValue) {
          newData.advancedSearch.minWords = 0;
          setSearchData(newData);
        }

        break;
      case "avgWordLength":
        newData.advancedSearch.avgWordLength = newValue
        setSearchData(newData);
        break;
      case "minWords":
        newData.advancedSearch.minWords = newValue
        setSearchData(newData)
        break;
    }
  }

  return (
    <div className="search collapse mb-3" id="advancedSearch" data-bs-parent="#accordion">
      <div className="words row">
      {
        searchData.advancedSearch.words.map((word, index) => {
              const finalIndex = searchData.advancedSearch.words.length - 1;
              return(<WordItem value={word} changeWord={changeWord} addWord={addWord} removeWords={removeWords} index={index} isFinal={index === finalIndex} key={index}></WordItem>)
        })
      }
      </div>
      <div className="search-parameters">
        <p className="display-6">פרמטרים לחיפוש:</p>
          <label htmlFor="avgWordLength">אורך מילה ממוצע</label>
          <div className="form-group input-group mb-3">
            <input value={searchData.advancedSearch.avgWordLength !== 0} onChange={handleParameterChange} id="avgWordLengthCheckbox" className="form-check form-check-input position-static me-3" type="checkbox"></input>
            <input value={searchData.advancedSearch.avgWordLength} onChange={handleParameterChange} id="avgWordLength" className="form-control" type="number" placeholder="0" disabled></input>
          </div>
          <label htmlFor="minWords">כמות מילים מינימלית במשפט:</label>
          <div className="form-group input-group mb-3">
            <input value={searchData.advancedSearch.minWords !== 0} onChange={handleParameterChange} id="minWordsCheckbox" className="form-check form-check-input position-static me-3" type="checkbox"></input>
            <input value={searchData.advancedSearch.minWords} onChange={handleParameterChange} id="minWords" className="form-control" type="number" placeholder="0" disabled></input>
          </div>
        </div>
    </div>
  );
}

export default AdvancedSearch;
