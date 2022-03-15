import React, { useState, useEffect, useRef } from 'react';
import { Collapse, Modal } from 'bootstrap';
import axios from 'axios';

import '../css/Search.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import BasicSearch from './BasicSearch';
import AdvancedSearch from './AdvancedSearch';
import SearchResults from './SearchResults';
import SearchContext from '../SearchContext';

function Search() {
  const sentenceListRef = useRef([]);
  const [searched, setSearched] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [sentenceFileNames, setSentenceFileNames] = useState([]);
  const [fileSelection, setFileSelection] = useState('')
  const [filteredSentences, setFilteredSentences] = useState([]);
  const [searchData, setSearchData] = useState({ basicSearch: { phrase: '' }, advancedSearch: { words: [{word: '', length: ''}], avgWordLength: '', minWords: '' }});
  const value = { searchData, setSearchData };

  const [wasValidated, setWasValidated] = useState(false);

  useEffect(async () => {
    const sentenceFileNames = await axios.get('/files/sentences/names');
    setSentenceFileNames(sentenceFileNames.data.fileNames);
  }, [])

  const toggleAdvanced = () => {
    const collapseList = Array.from(document.getElementsByClassName("collapse")).map((element) => {
      return new Collapse(element, { toggle: false });
    })
    
    collapseList.forEach(element => {
      element.toggle();
    });

    setAdvanced(!advanced)
  }

  const loadSentences = async () => {
    const res = await axios.get(`/files/sentences/${fileSelection}`);
    sentenceListRef.current = res.data;
  }

  const formatSentences = (sentences) => {
    return sentences.map((sentence) => {
      return sentence.split(" ").map((word) => { 
        return { "word": word, "length": word.length }
      })
    })
  }

  const matchAdvancedPattern = (formattedSentences) => {
    const sentenceObjects = formattedSentences.filter((sentence) => {
      if (sentence.length < searchData.advancedSearch.minWords ||
         (sentence.reduce((a,b) => a+b.length,0)/sentence.length) < searchData.advancedSearch.avgWordLength) {
        return false;
      }
      else {
        for (let i = 0; i < searchData.advancedSearch.words.length; i++) {
          if ((searchData.advancedSearch.words[i].word !== "" && searchData.advancedSearch.words[i].word             !== sentence[i].word) ||
              (searchData.advancedSearch.words[i].word === "" && parseInt(searchData.advancedSearch.words[i].length) !== sentence[i].length)) {
            return false;
          }
        }
        return true;
      }
    });

    return sentenceObjects.map((sentence) => {
      return sentence.map((word) => {
        return word.word;
      }).join(' ');
    })
  }

  const validateInput = () => {
    const validateNumber = (number) => {
      return number !== '' && !isNaN(number) && parseInt(number) > 0
    }

    if (fileSelection === '') {
      return false;
    }

    if (!advanced) {
      return searchData.basicSearch.phrase !== '';
    }
    
    if (!document.getElementById("avgWordLength").disabled && !validateNumber(searchData.advancedSearch.avgWordLength)) {
      return false;
    }
    
    if (!document.getElementById("minWords").disabled && !validateNumber(searchData.advancedSearch.minWords)) {
      return false;
    }

    return searchData.advancedSearch.words.every((word) => {
      return word.word !== '' || word.length !== ''
    });
  }

  const search = async (event) => {
    event.preventDefault();

    setFilteredSentences([]);

    if (!validateInput()) {
      setWasValidated(true);
      return;
    }

    setWasValidated(false);
    setSearched(true);

    if(sentenceListRef.current.length === 0) {
      await loadSentences();
    }

    if (advanced) {
      setFilteredSentences(matchAdvancedPattern(formatSentences(sentenceListRef.current)))
    } else {
      setFilteredSentences(sentenceListRef.current.filter((sentence) => {
        return sentence.includes(searchData.basicSearch.phrase)
      }))
    }
  }

  const changeFileSelection = (event) => {
    setFileSelection(event.target.value);
  }

  return (
    <SearchContext.Provider value={value}>
      <form className={`mt-3 ${wasValidated ? 'was-validated' : ''}`} noValidate>
          <p className="display-3 text-center">חיפוש</p>
          <div className="form-group col-6 mb-5 mx-auto text-center">
            <label htmlFor="sentenceFileSelect">בחר טקסט לחיפוש משפטים: </label>
            <select className="form-select" id="sentenceFileSelect" onChange={changeFileSelection} required>
              <option value='' selected disabled hidden>בחר כאן</option>
              {
                sentenceFileNames.map((fileName, index) => {
                  const data = fileName.replace(/\.[^/.]+$/, "").split('-');
                  const text = data[0];
                  const lexicon = data[1];
                  const offset = data[2];

                  return(<option value={fileName} key={text+lexicon+offset}>הטקסט {text} עם הלקסיקון {lexicon} בדילוג {offset} אותיות</option>);
                })
              }
            </select>
            <div className='invalid-feedback'>אנא בחר טקסט לחיפוש</div>
          </div>
          <div className="accordion" id="accordion">
          <BasicSearch></BasicSearch>
          <AdvancedSearch></AdvancedSearch>
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" onClick={search} className="btn btn-success">חפש</button>
            <button type="button" onClick={toggleAdvanced} id="collapseButton" className={`btn ${advanced ? "btn-info" : "btn-danger"}`} aria-expanded="false" aria-controls="basicSearch advancedSearch">{advanced ? "חיפוש בסיסי" : "חיפוש מתקדם"}</button>
          </div>
      </form>
      <div className="mt-3">
        {!searched ? '' : 
         filteredSentences.length !== 0 ? <SearchResults data={filteredSentences}></SearchResults> : "לא נמצאו תוצאות..." }
      </div>
    </SearchContext.Provider>
  );
}

export default Search;