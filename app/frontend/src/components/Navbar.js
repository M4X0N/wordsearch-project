import React from 'react';
import { Link } from 'react-router-dom'
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar() {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <Link class="nav-link" to="/sentence-finder">מצא משפטים </Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/search">חיפוש בטקסט קיים</Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/text-upload">העלה טקסט</Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/lexicon-upload">העלה לקסיקון</Link>
          </li>
        </ul>
      </div>
      </div>
    </nav>)};

export default Navbar;