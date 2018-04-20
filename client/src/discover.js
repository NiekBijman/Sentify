import React, { Component } from 'react';
import './styles/discover.css';
import { Link } from 'react-router-dom';
import Map from './containers/map';
import Search from './containers/search';

const Discover = ({}) =>
  <React.Fragment>
      <div className='map'>
          <Map/>
      </div>
      <div className='container-search'>
        <Search/>
      </div>
  </React.Fragment>

export default Discover;
