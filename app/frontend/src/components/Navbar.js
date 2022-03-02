import React from 'react';
import { Link } from 'react-router-dom'
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/sentence-finder">מצא משפטים </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/search">חיפוש בטקסט קיים</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/text-upload">העלה טקסט</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/lexicon-upload">העלה לקסיקון</Link>
          </li>
        </ul>
      </div>
      </div>
    </nav>)};

export default Navbar;