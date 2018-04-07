import React, { Component } from 'react';
import './styles/discover.css';
import { Link } from 'react-router-dom';
import Map from './containers/map';
import MapLive from './components/map-live';

const Discover = ({}) =>
      <React.Fragment>
        <div className="row">
          <div className="col-xs-10">
          </div>
          <div className="col-xs-2">
            <Map/>
          </div>
        </div>
      </React.Fragment>


export default Discover;
