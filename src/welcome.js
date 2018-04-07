import React, { Component } from 'react';
import './styles/welcome.css';
import { Link } from 'react-router-dom';
import Sentiment from './containers/sentiment';
import SentimentPie from './components/sentiment-pie';
import './styles/welcome.css';

const Welcome = ({}) =>
  <React.Fragment>
    <div className="Welcome">
      <div className ='row'>
        <div className='col-xs-4'>
            <input></input>
        </div>

        <div className='col-xs-4'>
          <Sentiment/>
        </div>
      </div>

      <Link to="/search">
          <button>Go to Map</button>
      </Link>
    </div>
  </React.Fragment>

export default Welcome;
