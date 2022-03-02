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

  const runSentenceFinder = async (event) => {
    event.preventDefault();

    try {
        await axios.post("/sentence-finder", {
        text_name: text.split(' ')[0],
        lexicon_name: lexicon.split(' ')[0],
        letter_offset: letterOffset,
        min_word_length: minWordLength,
        max_word_length: maxWordLength
        });
    } catch (error) {
        console.log("an unexpected error was encountered: ", error);
    }
  }

  return (
    <div className="sentence-finder mt-3">
        <form className="text-center">
            <div className="row mb-3">
                <p className="display-3 text-center">מציאת משפטים</p>
                <div className="texts col-6 text-center">
                    <div className="row">
                        <p className="display-5">טקסטים:</p>
                    </div>
                    {
                        textNames.map((name, index) => {
                            return (
                                <div className="row border-end" key={name}>
                                    <div className="form-check">
                                        <input name="text" value={name} onChange={changeOption} id={`textOption${index}`} className="form-check-input" type="radio"></input>
                                        <label htmlFor={`textOption${index}`} className="lead">{name}</label>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="lexicons col-6 text-center">
                    <div className="row">
                            <p className="display-5">מילונים:</p>
                    </div>
                    {
                        lexiconNames.map((name, index) => {
                            return (
                                <div className="row ps-3 border-start" key={name}>
                                    <div className="form-check">
                                        <input name="lexicon" value={name} onChange={changeOption} id={`lexiconOption${index}`} className="form-check-input" type="radio"></input>
                                        <label htmlFor={`lexiconOption${index}`} className="lead">{name}</label>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="form-group mb-3 mx-auto col-4">
                <label className="form-text mx-3" htmlFor="letterOffset">הזן מספר אותיות לדילוג:</label>
                <input value={letterOffset} onChange={changeLetterOffset} className="form-control" type="number" placeholder="0" id="letterOffset"></input>
            </div>
            <div className="row mb-3 d-flex justify-content-center">
                <div className="col-2">
                    <label className="form-text mx-3" htmlFor="minWordLength"><small>אורך מילה מינימלי במשפט:</small></label>
                    <input value={minWordLength} onChange={changeMinWordLength} className="form-control" type="number" placeholder="0" id="minWordLength"></input>
                </div>
                <div className="col-2">
                    <label className="form-text mx-3" htmlFor="maxWordLength"><small>אורך מילה מקסימלי במשפט:</small></label>
                    <input value={maxWordLength} onChange={changeMaxWordLength} className="form-control" type="number" placeholder="0" id="maxWordLength"></input>
                </div>
            </div>
            <button onClick={runSentenceFinder} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#sentenceFinderLoading" type="submit">מצא משפטים</button>
            <Loading message="החיפוש מתבצע כעת... פעולה זו עלולה לקחת מספר דקות" id="sentenceFinderLoading"></Loading>
        </form>
    </div>
  );
}

export default SentenceFinder;