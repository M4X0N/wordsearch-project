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
      if (props.value.word.length === 0 || props.value.length === '') {
        props.removeWords(props.index);

        return;
      }
    }

    if (event.key === " ") {
      props.addWord();
      // stop any further event processing so spaces won't be appended to new words by onChange
      event.preventDefault();
    }
  }

  return (
    <div className='word-item form-group col-3'>
        <div class="input-group">
        <button class="btn btn-outline-secondary" onClick={toggleSelector} type="button">
          <i class={`bi ${ selector === 'word' ? 'bi-quote' : 'bi-123' }`}></i>
        </button>
        <input id="word-1" value={props.value[selector]} onChange={changeWord} onKeyDown={handleKeyPress} class="word form-control" placeholder={ selector === 'word' ? "הזן מילה" : "הזן אורך מילה"}></input>
        { props.isFinal && ((selector === 'word' && props.value.word.length > 0) || (selector === 'length' && props.value.length > 0)) ? 
          <button class="btn btn-outline-secondary" onClick={props.addWord} type="button">
            <i class="bi bi-plus"></i>
          </button> :
         '' }
        </div>
    </div>
  );
}

export default WordItem;