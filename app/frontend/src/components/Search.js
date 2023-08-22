import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';

import '../css/Search.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { Collapse } from "bootstrap";
import BasicSearch from './BasicSearch';
import AdvancedSearch from './AdvancedSearch';
import SearchContext from "../contexts/SearchContext";
import SearchResults from './SearchResults';
import LanguageContext from "../contexts/LanguageContext"

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
  const data = useContext(LanguageContext).data.search;
  const text_options = data.text_option_words;

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

  const loadSentences = async (event) => {
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

  const isEmpty = (word) => {
    return word.word === '' && word.length === '';
  }

  const advancedSearch = (formattedSentences) => {
    let sentenceResults = formattedSentences;

    if (searchData.advancedSearch.minWords !== '') {
      sentenceResults = sentenceResults.filter((sentence) => {
        return sentence.length >= searchData.advancedSearch.minWords;
      })
    }

    if (searchData.advancedSearch.avgWordLength !== '') {
      sentenceResults = sentenceResults.filter((sentence) => {
        return (sentence.reduce((a, b) => a + b.length, 0) / sentence.length) >= searchData.advancedSearch.avgWordLength
      })
    }

    if (!isEmpty(searchData.advancedSearch.words[0])) {
      sentenceResults = sentenceResults.filter((sentence) => {
        for (let i = 0; i < searchData.advancedSearch.words.length; i++) {
          if (searchData.advancedSearch.words[i].word !== "" && sentence[i].word !== searchData.advancedSearch.words[i].word ||
              searchData.advancedSearch.words[i].word === "" && parseInt(searchData.advancedSearch.words[i].length) !== sentence[i].length) {
            return false
          }
        }

        return true
      })
    }
    
    return sentenceResults.map((sentence) => {
      return sentence.map((word) => {
        return word.word;
      }).join(' ');
    })
  }

  const validateInput = () => {
    const validateNumber = (number) => {
      return number !== '' && !isNaN(number) && parseInt(number) > 0;
    }

    if (fileSelection === '') {
      return false;
    }

    if (!advanced) {
      return searchData.basicSearch.phrase !== '';
    }

    const avgWordLength = document.getElementById("avgWordLength");
    const minWords = document.getElementById("minWords");
    
    if (!avgWordLength.disabled && !validateNumber(searchData.advancedSearch.avgWordLength)) {
      return false;
    }
    
    if (!minWords.disabled && !validateNumber(searchData.advancedSearch.minWords)) {
      return false;
    }

    if (searchData.advancedSearch.words.length === 1 && isEmpty(searchData.advancedSearch.words[0])) {
      return searchData.advancedSearch.avgWordLength !== '' || searchData.advancedSearch.minWords !== '';
    }

    return searchData.advancedSearch.words.every((word) => !isEmpty(word));
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
      setFilteredSentences(advancedSearch(formatSentences(sentenceListRef.current)))
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
      <div className="mt-3">
          <form className={`mt-3 mb-3 ${wasValidated ? 'was-validated' : ''}`} noValidate>
              <p className="display-3 text-center">{data.search}</p>
              <div className="form-group col-6 mb-5 mx-auto text-center">
                <label htmlFor="sentenceFileSelect">{data.choose_text}</label>
                <select className="form-select" id="sentenceFileSelect" onChange={changeFileSelection} required>
                  <option value='' selected disabled hidden>{data.choose_here}</option>
                  {
                    sentenceFileNames.map((fileName, index) => {
                      const data = fileName.replace(/\.[^/.]+$/, "").split('=');
                      const text = data[0];
                      const lexicon = data[1];
                      const offset = data[2];

                      return(<option value={fileName} key={text+lexicon+offset}>{text_options[0]} {text} {text_options[1]}  {lexicon} {text_options[2]}  {offset} {text_options[3]} </option>);
                    })
                  }
                </select>
              </div>
              <div className="accordion" id="accordion">
              <BasicSearch></BasicSearch>
              <AdvancedSearch></AdvancedSearch>
              </div>
              <div className="d-flex justify-content-between">
              <button type="submit" onClick={search} className="btn btn-success">{data.submit}</button>
              <button type="button" onClick={toggleAdvanced} id="collapseButton" className={`btn ${advanced ? "btn-info" : "btn-danger"}`} aria-expanded="false" aria-controls="basicSearch advancedSearch">{advanced ? data.basic_search : data.advanced_search}</button>
              </div>
          </form>
          { !searched ? '' :
            filteredSentences.length !== 0 ? <SearchResults data={filteredSentences}></SearchResults> : data.no_results }
      </div>
    </SearchContext.Provider>
  );
}

export default Search;
