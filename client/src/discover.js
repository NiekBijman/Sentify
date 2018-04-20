import React, { Component } from 'react';
import './styles/discover.css';
import { Link } from 'react-router-dom';
import Map from './containers/map';
import Search from './containers/search';
import SentimentView from './containers/sentiment-view';

const Discover = ({}) =>
  <React.Fragment>
    <div className="container-discover">
      <div className='map'>
          <Map/>
      </div>
      <div className='container-search'>
        <Search/>
      </div>
      <SentimentView/>
    </div>
  </React.Fragment>

export default Discover;
