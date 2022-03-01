import { useEffect, useState } from 'react';

import Loading from "./Loading";

import '../css/SentenceFinder.css';

import axios from "axios";

function SentenceFinder(props) {
  const [textNames, setTextNames] = useState([]);
  const [lexiconNames, setLexiconNames] = useState([]);

  const [text, setText] = useState('');
  const [lexicon, setLexicon] = useState('');
  const [letterOffset, setLetterOffset] = useState(0);
  const [minWordLength, setMinWordLength] = useState(0);
  const [maxWordLength, setMaxWordLength] = useState(0);

  useEffect(async () => {
    const textNames = await axios.get("/files/texts");
    const lexiconNames = await axios.get("/files/lexicons");

    setTextNames(textNames.data.fileNames);
    setLexiconNames(lexiconNames.data.fileNames);
  }, [])

  const changeLetterOffset = (event) => {
    setLetterOffset(event.target.value);
  }

  const changeMinWordLength = (event) => {
      setMinWordLength(event.target.value);
  }

  const changeMaxWordLength = (event) => {
    setMaxWordLength(event.target.value);
}

  const changeOption = (event) => {
    if (event.target.id.includes("text")) {
        setText(event.currentTarget.value);
        return;
    } 

    setLexicon(event.currentTarget.value);
  }

  const runSentenceFinder = (event) => {
    event.preventDefault();

    axios.post("/sentence-finder", {
        text_name: text.split(' ')[0],
        lexicon_name: lexicon.split(' ')[0],
        letter_offset: letterOffset,
        min_word_length: minWordLength,
        max_word_length: maxWordLength
    })
  }

  return (
    <div className="sentence-finder mt-3">
        <form class="text-center">
            <div class="row mb-3">
                <p class="display-3 text-center">מציאת משפטים</p>
                <div class="texts col-6 text-center">
                    <div class="row">
                        <p class="display-5">טקסטים:</p>
                    </div>
                    {
                        textNames.map((name, index) => {
                            return (
                                <div class="row border-end" key={name}>
                                    <div class="form-check">
                                        <input name="text" value={name} onChange={changeOption} id={`textOption${index}`} class="form-check-input" type="radio"></input>
                                        <label for={`textOption${index}`} class="lead">{name}</label>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div class="lexicons col-6 text-center">
                    <div class="row">
                            <p class="display-5">מילונים:</p>
                    </div>
                    {
                        lexiconNames.map((name, index) => {
                            return (
                                <div class="row ps-3 border-start" key={name}>
                                    <div class="form-check">
                                        <input name="lexicon" value={name} onChange={changeOption} id={`lexiconOption${index}`} class="form-check-input" type="radio"></input>
                                        <label for={`lexiconOption${index}`} class="lead">{name}</label>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div class="form-group mb-3 mx-auto col-4">
                <label class="form-text mx-3" for="letterOffset">הזן מספר אותיות לדילוג:</label>
                <input value={letterOffset} onChange={changeLetterOffset} class="form-control" type="number" placeholder="0" id="letterOffset"></input>
            </div>
            <div class="row mb-3 d-flex justify-content-center">
                <div class="col-2">
                    <label class="form-text mx-3" for="minWordLength"><small>אורך מילה מינימלי במשפט:</small></label>
                    <input value={minWordLength} onChange={changeMinWordLength} class="form-control" type="number" placeholder="0" id="minWordLength"></input>
                </div>
                <div class="col-2">
                    <label class="form-text mx-3" for="maxWordLength"><small>אורך מילה מקסימלי במשפט:</small></label>
                    <input value={maxWordLength} onChange={changeMaxWordLength} class="form-control" type="number" placeholder="0" id="maxWordLength"></input>
                </div>
            </div>
            <button onClick={runSentenceFinder} class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#sentenceFinderLoading" type="submit">מצא משפטים</button>
            <Loading message="החיפוש מתבצע כעת... פעולה זו עלולה לקחת מספר דקות" id="sentenceFinderLoading"></Loading>
        </form>
    </div>
  );
}

export default SentenceFinder;