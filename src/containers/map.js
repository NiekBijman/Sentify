import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MapLive from '../components/map-live';

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mapContainer: null,
      style: null
    }
  }
  componentDidMount() {
    var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
    mapboxgl.accessToken = 'pk.eyJ1Ijoibmlla2Jpam1hbiIsImEiOiJjamY0MnN2NXkxaGpjMzRwZHloM3FoZG9uIn0.eZBRbD2LO-4yNS-gXVtRag';
    this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/dark-v9'
            });
    this.setState({
      mapContainer: this.mapContainer
    })
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
      <React.Fragment>
        <div style={style} ref={el => this.mapContainer = el}></div>
      </React.Fragment>
    );
  }
}

export default Map;
