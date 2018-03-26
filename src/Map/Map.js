import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Map extends React.Component {
  componentDidMount() {
    var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
    mapboxgl.accessToken = 'pk.eyJ1Ijoibmlla2Jpam1hbiIsImEiOiJjamY0MnN2NXkxaGpjMzRwZHloM3FoZG9uIn0.eZBRbD2LO-4yNS-gXVtRag';
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9'
    });

    console.log(this.map);


  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    const style = {
      position: 'absolute',
      top: 100,
      bottom: 100,
      width: '30%',
      // background-color: #fff
    };
    return(
      <div style={style} ref={el => this.mapContainer = el}></div>
    );
  }
}

export default Map;
