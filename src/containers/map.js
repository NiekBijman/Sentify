import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import { Link } from 'react-router-dom';
import LocationInfo from '../components/map-locationinfo';
import '../styles/map.css';


class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lng: 5,
      lat: 34,
      zoom: 1.5
    };
  }

  componentDidMount() {
      const { lng, lat, zoom } = this.state;
      mapboxgl.accessToken = 'pk.eyJ1Ijoibmlla2Jpam1hbiIsImEiOiJjamY0MnN2NXkxaGpjMzRwZHloM3FoZG9uIn0.eZBRbD2LO-4yNS-gXVtRag';


      const map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/niekbijman/cjftubitf16572rpdp0scokcm',
        center: [lng, lat], zoom,
        minZoom: Number(1.5),
        attributionControl: false,
        logoPosition: 'bottom-right',
        bearingSnap: Number(12)
      });
      console.log(map);

       map.on('move', () => {
        const { lng, lat } = map.getCenter();

        this.setState({
          lng: lng.toFixed(4),
          lat: lat.toFixed(4),
          zoom: map.getZoom().toFixed(2)
        });
      });
    }

    render() {
      const { lng, lat, zoom } = this.state;

      const style = {
        position: 'absolute',
        left: 10,
        right: -10,
        top: 0,
        bottom: 0,
        width: '100%'
      };

      return (
        <React.Fragment>
            <div  style={style} ref={el => this.mapContainer = el} />
            <LocationInfo Long={lng} Lat={lat} Zoom={zoom}/>
        </React.Fragment>
      );
    }
}

export default Map;
