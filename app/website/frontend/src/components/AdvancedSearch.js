import { useEffect, useState } from "react";

import '../css/AdvancedSearch.css';

import WordItem from "./WordItem";

function AdvancedSearch() {
  const wordsPerRow = 4;

  const [words, setWords] = useState([[{ word: '', length: 0 }]]);

  const [avgWordLengthCheckbox, setAvgWordLengthCheckbox] = useState(false);
  const [avgWordLength, setAvgWordLength] = useState(0);

  const [minWordsCheckbox, setMinWordsCheckbox] = useState(false);
  const [minWords, setMinWords] = useState(0);

  const focusOnLast = () => {
    const numOfWordItems = document.getElementsByClassName('word-item').length;
    const lastWordItem = document.getElementsByClassName('word-item')[numOfWordItems - 1];
    lastWordItem.getElementsByTagName('input')[0].focus();
  }

  const changeValueOnCoordinates = (index, selector, newValue) => {
    const newWords = JSON.parse(JSON.stringify(words));
    const row = Math.trunc(index / wordsPerRow);
    const col = index % wordsPerRow;
    newWords[row][col] = { ...newWords[row][col], [selector]: newValue };
    return newWords;
  }

  const removeWordAfterCoordinates = (index) => {
    // including the specified coordinate
    const newWords = JSON.parse(JSON.stringify(words));

    const lastRowCoord = words.length - 1;
    const indexRowCoord = Math.trunc(index / wordsPerRow);
    const indexColCoord = index % wordsPerRow;

    if (indexColCoord === 0 && indexRowCoord === 0) {
      return [[{ word: '', length: 0 }]];
    }

    if (indexRowCoord < lastRowCoord) {
      // remove rows from indexRowCoord + 1 up to the last row
      newWords.splice(indexRowCoord + 1, lastRowCoord - indexRowCoord)
    }

    const lastColCoord = newWords[newWords.length - 1].length - 1;

    newWords[indexRowCoord].splice(indexColCoord, lastColCoord - indexColCoord + 1);

    if (newWords[indexRowCoord].length === 0) {
      newWords.pop();
    }

    return newWords;
  }

  const addWord = async () => {
    const newWords = JSON.parse(JSON.stringify(words));
    const lastRowIndex = words.length - 1;
    const lastRowCols = newWords[lastRowIndex].length;

    if (lastRowCols < wordsPerRow) {
      // push word to last row
      newWords[lastRowIndex].push({ word: '', length: 0 });
    } else {
      // push new row
      newWords.push([{ word: '', length: 0 }]);
    }

    await setWords(newWords);
    focusOnLast();
  }

  const changeWord = (index, selector, newValue) => {
    setWords(changeValueOnCoordinates(index, selector, newValue))
  }

  const removeWords = async (index) => {
    await setWords(removeWordAfterCoordinates(index));
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

    switch (inputId) {
      // don't know why negation is necessary here
      case "avgWordLengthCheckbox":
        setAvgWordLengthCheckbox(!newValue);
        document.getElementById("avgWordLength").disabled = newValue ? false : true;

        break;
      case "minWordsCheckbox":
        setMinWordsCheckbox(!newValue);
        document.getElementById("minWords").disabled = newValue ? false : true;

        break;
      case "avgWordLength":
        setAvgWordLength(newValue);
        break;
      case "minWords":
        setMinWords(newValue)
        break;
    }
  }

  return (
    <div className="search collapse mb-3" id="advancedSearch" data-bs-parent="#accordion">
      <div class="words">
      {
        words.map((wordRow, rowIndex) => {
          return (
            <div class="row mb-3" key={rowIndex}>
              {wordRow.map((word, colIndex) => {
                const index = rowIndex * wordsPerRow + colIndex;
                const finalIndex = (words.length - 1) * wordsPerRow + words[words.length - 1].length - 1;
                return(<WordItem value={word} changeWord={changeWord} addWord={addWord} removeWords={removeWords} index={index} isFinal={index === finalIndex} key={index}></WordItem>)
              })}
            </div>
          )
        })
      }
      </div>
      <div class="search-parameters">
        <p class="display-6">פרמטרים לחיפוש:</p>
          <label for="avgWordLength">אורך מילה ממוצע</label>
          <div class="form-group input-group mb-3">
            <input value={avgWordLengthCheckbox} onChange={handleParameterChange} id="avgWordLengthCheckbox" class="form-check form-check-input position-static mx-3" type="checkbox"></input>
            <input value={avgWordLength} onChange={handleParameterChange} id="avgWordLength" class="form-control" type="number" placeholder="0" disabled></input>
          </div>
          <label for="minWords">כמות מילים מינימלית במשפט:</label>
          <div class="form-group input-group mb-3">
            <input value={minWordsCheckbox} onChange={handleParameterChange} id="minWordsCheckbox" class="form-check form-check-input position-static mx-3" type="checkbox"></input>
            <input value={minWords} onChange={handleParameterChange} id="minWords" class="form-control" type="number" placeholder="0" disabled></input>
          </div>
        </div>
    </div>
  );
}

export default AdvancedSearch;
