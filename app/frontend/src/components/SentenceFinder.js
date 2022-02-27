import { useEffect, useState } from 'react';

import '../css/SentenceFinder.css';

import axios from "axios";

function SentenceFinder(props) {
  const [textNames, setTextNames] = useState([]);
  const [lexiconNames, setLexiconNames] = useState([]);

  const [text, setText] = useState('');
  const [lexicon, setLexicon] = useState('');
  const [wordOffset, setWordOffset] = useState(0);

  useEffect(async () => {
    const textNames = await axios.get("/files/texts");
    const lexiconNames = await axios.get("/files/lexicons");

    setTextNames(textNames.data.fileNames);
    setLexiconNames(lexiconNames.data.fileNames);
  }, [])

  const changeWordOffset = (event) => {
    setWordOffset(event.target.value);
  }

  const changeOption = (event) => {
    if (event.target.id.includes("text")) {
        setText(event.currentTarget.value);
        return;
    } 

    setLexicon(event.currentTarget.value);
  }

  return (
    <div className="sentence-finder mt-3">
        <form class="text-center">
            <div class="row mb-3">
                <p class="display-1 text-center">מציאת משפטים</p>
                <div class="texts col-6 text-center">
                    <div class="row">
                        <p class="display-5">טקסטים:</p>
                    </div>
                    {
                        textNames.map((name, index) => {
                            return (
                                <div class="row border-end" key={name}>
                                    <div class="form-check">
                                        <input name="text" value={index} checked={index === text} onChange={changeOption} id={`textOption${index}`} class="form-check-input" type="radio"></input>
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
                                <div class="row ms-3" key={name}>
                                    <div class="form-check">
                                        <input name="lexicon" value={index} check={index === lexicon} onChange={changeOption} id={`lexiconOption${index}`} class="form-check-input" type="radio"></input>
                                        <label for={`lexiconOption${index}`} class="lead">{name}</label>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div class="form-group mb-3 mx-auto col-4">
                <label class="form-text mx-3" for="wordOffset">הזן מספר אותיות לדילוג:</label>
                <input value={wordOffset} onChange={changeWordOffset} class="form-control" type="number" placeholder="0" id="wordOffset"></input>
            </div>
            <button class="btn btn-primary" type="submit">מצא משפטים</button>
        </form>
    </div>
  );
}

export default SentenceFinder;