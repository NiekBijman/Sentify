import React, { Component } from 'react';
import './Welcome.css';
import { Link } from 'react-router-dom';
import Pie from '../Pie/Pie';

class Welcome extends Component {

  render() {
    return (
      <div className="Welcome">
        <p>
            Welcome to React Startup code!
        </p>
        <Pie/>
        <Link to="/search">
            <button>Go to Map</button>
        </Link>
      </div>
    );
  }
}

export default Welcome;
