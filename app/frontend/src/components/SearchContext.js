import React from "react";

const data = {
    basicSearch: { phrase: '' },
    advancedSearch: { words: [{word: '', length: ''}], avgWordLength: 0, minWords: 0 }
}

const SearchContext = React.createContext(data);

export default SearchContext;