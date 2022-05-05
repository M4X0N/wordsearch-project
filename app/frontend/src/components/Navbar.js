import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import LanguageContext from "../contexts/LanguageContext"
import "bootstrap-icons/font/bootstrap-icons.css";
import gb from "../gb.svg"
import il from "../il.svg"
const localization = require('../localization.json')


function Navbar() {
  const { data, setData } = useContext(LanguageContext)


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container row">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/sentence-finder"> {data.navbar.sentence_finder} </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/search">{data.navbar.search_text}</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/text-upload">{data.navbar.text_upload}</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/lexicon-upload">{data.navbar.lexicon_upload}</Link>
          </li>
          <li onClick={() => setData(localization.hebrew)} className="nav-item nav-link">
            <img style={{width:20,height:15}} src={il}/>
          </li>
          <li onClick={() => setData(localization.english)} className="nav-item nav-link">
            <img style={{width:20,maxHeight:15}} src={gb}/>
          </li>
        </ul>
      </div>
    </nav>
  )
};

export default Navbar;