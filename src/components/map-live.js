import React, { Component } from 'react';

const MapLive = ({mapContainer}) =>(
  <React.Fragment>
    <div style={style} ref={el => mapContainer = el}></div>
  </React.Fragment>
);
export default MapLive;


const style = {
  position: 'absolute',
  top: 100,
  bottom: 100,
  width: '30%',
  // background-color: #fff
};
