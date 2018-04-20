import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../styles/map.css';

const LocationInfo = ({Long, Lat, Zoom}) =>
<React.Fragment>
  <div className='container-locationinfo' >{`Longitude: ${Long} Latitude: ${Lat} Zoom: ${Zoom}`}</div>
</React.Fragment>

export default LocationInfo;
