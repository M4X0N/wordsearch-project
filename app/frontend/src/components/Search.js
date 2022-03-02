import { useState, useEffect } from 'react';
import axios from 'axios';

import '../css/Search.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import BasicSearch from './BasicSearch';
import AdvancedSearch from './AdvancedSearch';
import Loading from './Loading';

function Search() {
  useEffect(async () => {
    const sentenceFileNames = await axios.get('/files/sentences');
    setSentenceFileNames(sentenceFileNames.data.fileNames);
  }, [])

  const [advanced, setAdvanced] = useState(false);
  const [sentenceFileNames, setSentenceFileNames] = useState([]);
  const [fileSelection, setFileSelection] = ('')
  const [sentenceList, setSentenceList] = useState([]);
  const [filteredSentences, setFilteredSentences] = useState([]);
  const searchData = {
    "basic":"אבא"
  }
  const toggleAdvanced = () => {
    setAdvanced(!advanced)
  }

  const search = (event) => {
    event.preventDefault();

    // Eyal's sentence loader goes here before Dror's search

    if (advanced) {
      
    } else {
      setFilteredSentences(sentenceList.filter((sentence) => {
        return sentence.includes(searchData.basic)
      }))
    }   
  }

  const changeFileSelection = (event) => {
    setFileSelection(event.target.value);
  }

  return (
    <div className="mt-3">
        <form>
            <p class="display-3 text-center">חיפוש</p>
            <div class="form-group col-6 mb-3">
              <label for="sentenceFileSelect">בחר טקסט לחיפוש משפטים: </label>
              <select class="form-control" id="sentenceFileSelect" onChange={changeFileSelection}>
                {
                  sentenceFileNames.map((fileName) => {
                    const data = fileName.replace(/\.[^/.]+$/, "").split('-');
                    const text = data[0];
                    const lexicon = data[1];
                    const offset = data[2];

                    return(<option value={fileName}>הטקסט {text} עם הלקסיקון {lexicon} בדילוג {offset} אותיות</option>);
                  })
                }
              </select>
            </div>
            <div class="accordion" id="accordion">
            <BasicSearch></BasicSearch>
            <AdvancedSearch></AdvancedSearch>
            </div>
            <div class="d-flex justify-content-between">
            <button type="submit" onClick={search} class="btn btn-success" data-bs-toggle="modal" data-bs-target="#searchLoading">חפש</button>
            <button type="button" onClick={toggleAdvanced} data-bs-toggle="collapse" data-bs-target=".search" class={`btn ${advanced ? "btn-info" : "btn-danger"}`} aria-expanded="false" aria-controls="basicSearch advancedSearch">{advanced ? "חיפוש בסיסי" : "חיפוש מתקדם"}</button>
            </div>
        </form>
        <Loading message="החיפוש מתבצע כעת..." id="searchLoading"></Loading>
    </div>
  );
}

export default Search;
