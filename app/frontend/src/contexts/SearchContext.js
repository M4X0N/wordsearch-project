import React from "react";

const data = {
    basicSearch: { phrase: '' },
    advancedSearch: { words: [{word: '', length: ''}], avgWordLength: '', minWords: '' }
}

const SearchContext = React.createContext(data);

export default SearchContext;