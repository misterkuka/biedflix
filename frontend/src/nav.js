import React, { Component } from 'react';
import axios from 'axios';
import './nav.css';
class Nav extends Component {


  render() {
      return (

        <nav>
        <div className="nav-wrapper black">
        <a href="#" className="brand-logo center"><img height="50px" src="biedflix_logo.png"/></a>
        </div>
        </nav>
      );
    }
  }
export default Nav;
