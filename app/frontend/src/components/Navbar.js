import React from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar() {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="/sentence-finder">מצא משפטים </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/search">חיפוש בטקסט קיים</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/text-upload">העלה טקסט</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/lexicon-upload">העלה לקסיקון</a>
          </li>
        </ul>
      </div>
      </div>
    </nav>)};

export default Navbar;