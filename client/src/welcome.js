import React, { Component } from 'react';
import './styles/welcome.css';
import { Link } from 'react-router-dom';
import Sentiment from './containers/sentiment';
import SentimentPie from './components/sentiment-pie';
import Search from './containers/search';
import './styles/welcome.css';


const Welcome = ({}) =>
  <div className='row'>
    <div className='col-xs-5'>
      <Search/>
      <Link to="/discover">
          <button className='btn btn-xs'>Go to Map</button>
      </Link>
    </div>
    <div className='col-xs-5'>
      <Sentiment/>
    </div>
  </div>

export default Welcome;
