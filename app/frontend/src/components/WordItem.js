import { useState } from 'react';

import '../css/WordItem.css';

function WordItem(props) {
  const [selector, setSelector] = useState('word');

  const toggleSelector = () => {
    if (selector === 'word') {
      setSelector('length');
      return;
    }
    setSelector('word');
  }

  const changeWord = (event) => {
    const value = event.target.value;
    props.changeWord(props.index, selector, value)
  }

  const handleKeyPress = (event) => {
    if (event.key === "Backspace" || event.key === "Delete") {
      if (props.value[selector].length === 0)  {
        props.removeWords(props.index);

        return;
      }
    }

    if (event.key === " ") {
      props.addWord();
      // stop any further event processing so spaces won't be appended to new words by onChange
      event.preventDefault();

      return;
    }
  }

  return (
    <div className='word-item form-group col-3 mb-3'>
        <div className="input-group">
        <button className="btn btn-outline-secondary" onClick={toggleSelector} type="button">
          <i className={`bi ${ selector === 'word' ? 'bi-quote' : 'bi-123' }`}></i>
        </button>
        <input id={`props-${props.index}`} value={props.value[selector]} onChange={changeWord} onKeyDown={handleKeyPress} className="word form-control" placeholder={ selector === 'word' ? "הזן מילה" : "הזן אורך מילה"} required></input>
        { props.isFinal && ((selector === 'word' && props.value.word.length > 0) || (selector === 'length' && props.value.length.length > 0)) ? 
          <button className="btn btn-outline-secondary" onClick={props.addWord} type="button">
            <i className="bi bi-plus"></i>
          </button> :
         '' }
        </div>
    </div>
  );
}

export default WordItem;