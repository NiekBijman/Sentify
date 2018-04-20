import React from 'react';
import '../styles/map.css';

const LocationInfo = ({Long, Lat, Zoom}) =>
<React.Fragment>
  <div className='container-location-info' >{`Longitude: ${Long} Latitude: ${Lat} Zoom: ${Zoom}`}</div>
</React.Fragment>

export default LocationInfo;
