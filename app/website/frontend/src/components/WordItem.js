import '../css/WordItem.css';

function WordItem() {
  return (
    <div className='word-item form-group col-3'>
        <div class="input-group">
        <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" type="button"></button>
        <div class="dropdown-menu">
            <div class="">
            <p>number goes here</p>
            </div>
        </div>
        <input id="word-1" class="word form-control" placeholder="הזן או בחר אורך מילה"></input>
        <button class="btn btn-outline-secondary" type="button">
            <i class="bi bi-plus"></i>
        </button>
        </div>
    </div>
  );
}

export default WordItem;