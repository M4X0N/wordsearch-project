import { useEffect, useState, useContext } from 'react';

import Loading from "./Loading";

import '../css/SentenceFinder.css';

import axios from "axios";
import { Modal } from "bootstrap";

import LanguageContext from "../contexts/LanguageContext"

function SentenceFinder(props) {
  const [textNames, setTextNames] = useState([]);
  const [lexiconNames, setLexiconNames] = useState([]);
  const [text, setText] = useState('');
  const [lexicon, setLexicon] = useState('');
  const [letterOffset, setLetterOffset] = useState('');
  const [minWordLength, setMinWordLength] = useState('');
  const [maxWordLength, setMaxWordLength] = useState('');
  const [wasValidated, setWasValidated] = useState(false);
  const data = useContext(LanguageContext).data.sentence_finder

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

  const validateInput = () => {
    const validateNumber = (number) => {
        return number !== '' && !isNaN(number) && parseInt(number) > 0
    }

    return text !== '' && lexicon !== '' &&
        validateNumber(letterOffset) &&
        validateNumber(minWordLength) &&
        validateNumber(maxWordLength) &&
        parseInt(minWordLength) < parseInt(maxWordLength);
  }

  const runSentenceFinder = async (event) => {
    event.preventDefault();

    if (!validateInput()) {
        setWasValidated(true);
        return;
    }

    setWasValidated(false);

    const modal = new Modal(document.getElementById("sentenceFinderLoading"));
    modal.show();

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
        <form className={`text-center ${wasValidated ? 'was-validated' : ''}`} noValidate>
            <div className="row mb-3">
                <p className="display-3 text-center">{data.find_sentences}</p>
                <div className="texts col-6 text-center">
                    <div className="row">
                        <p className="display-5">{data.texts}</p>
                    </div>
                    {
                        textNames.map((name, index) => {
                            return (
                                <div className="row border-end" key={name}>
                                    <div className="form-check">
                                        <input name="text" value={name} onChange={changeOption} id={`textOption${index}`} className="form-check-input" type="radio" required></input>
                                        <label htmlFor={`textOption${index}`} className="lead">{name}</label>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="lexicons col-6 text-center">
                    <div className="row">
                        <p className="display-5">{data.lexicons}</p>
                    </div>
                    {
                        lexiconNames.map((name, index) => {
                            return (
                                <div className="row ps-3 border-start" key={name}>
                                    <div className="form-check">
                                        <input name="lexicon" value={name} onChange={changeOption} id={`lexiconOption${index}`} className="form-check-input" type="radio" required></input>
                                        <label htmlFor={`lexiconOption${index}`} className="lead">{name}</label>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="form-group mb-3 mx-auto col-4">
                <label className="form-text mx-3" htmlFor="letterOffset">{data.letter_offset}</label>
                <input value={letterOffset} onChange={changeLetterOffset} className="form-control" type="number" placeholder="0" id="letterOffset" required min="2"></input>
                <div className="invalid-feedback">{data.invalid_feedback_over_zero}</div>
            </div>
            <div className="row mb-3 d-flex justify-content-center">
                <div className="col-2">
                    <label className="form-text mx-3" htmlFor="minWordLength"><small>{data.min_word_length}</small></label>
                    <input value={minWordLength} onChange={changeMinWordLength} className="form-control" type="number" placeholder="0" id="minWordLength" required min="1"></input>
                    <div className="invalid-feedback">{data.invalid_feedback_over_zero}</div>
                </div>
                <div className="col-2">
                    <label className="form-text mx-3" htmlFor="maxWordLength"><small>{data.max_word_length}</small></label>
                    <input value={maxWordLength} onChange={changeMaxWordLength} className="form-control" type="number" placeholder="0" id="maxWordLength" required min="1"></input>
                    <div className="invalid-feedback">{data.invalid_feedback_over_minimum}</div>
                </div>
            </div>
            <button onClick={runSentenceFinder} className="btn btn-primary" type="submit">{data.submit}</button>
            <Loading message={data.loading} id="sentenceFinderLoading"></Loading>
        </form>
    </div>
  );
}

export default SentenceFinder;