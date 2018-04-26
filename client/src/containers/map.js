import React from 'react';
import mapboxgl from 'mapbox-gl';
import * as d3 from "d3";
import DrawCircle from '../components/map-draw'
// import { circleSelector } from '../components/map-circle-selection';
import LocationInfo from '../components/map-location-info';
import '../styles/map.css';
import Button from 'material-ui/Button';
import { modelInstance } from '../model/model';
import { Row, Col } from 'react-flexbox-grid';

class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      coordinates: modelInstance.getCoordinates(),
      lng: modelInstance.getCoordinates()[0],
      lat: modelInstance.getCoordinates()[1],
      zoom: 1.5,
      flyTo: { center: [-122.404357, 37.791246]},
      // newCoordinates: false
    };
  }

  componentDidMount() {
      modelInstance.addObserver(this);
      this.mapBox(this.state.coordinates, this.state.zoom);


  }

  mapBox = (coordinates, zoom) => {

    mapboxgl.accessToken = 'pk.eyJ1Ijoibmlla2Jpam1hbiIsImEiOiJjamY0MnN2NXkxaGpjMzRwZHloM3FoZG9uIn0.eZBRbD2LO-4yNS-gXVtRag';

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/niekbijman/cjftubitf16572rpdp0scokcm',
      center: coordinates,
      zoom: zoom,
      minZoom: Number(1.5),
      attributionControl: false,
      logoPosition: 'bottom-right',
      bearingSnap: Number(12),
      pitchWithRotate: false,
      dragRotate: false
    });

    // Setup our svg layer that we can manipulate with d3
    var container = map.getCanvasContainer()
    var svg = d3.select(container).append("svg")

    var active = true;
    var circleControl = new DrawCircle(svg)
      .projection(project)
      .inverseProjection(function(a) {
        return map.unproject({x: a[0], y: a[1]});
      })
      .activate(active);

    function project(d) {
      return map.project(getLL(d));
    }
    function getLL(d) {
      return new mapboxgl.LngLat(+d.lng, +d.lat)
    }

    // re-render our visualization whenever the view changes
    // map.on("viewreset", () => {
    //   this.circleRender(circleControl, svg)
    // })
    map.on("move", () => {
      this.circleRender(circleControl, svg)
    })

    // render our initial visualization
    this.circleRender(circleControl, svg)

   map.on('move', () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }

  circleRender(circleControl, svg) {
    circleControl.update(svg)
  }

  update(details) {
    if(details ==='jumpToCoordinates'){
      var coordinates = modelInstance.getCoordinates();
      var zoom = 8

      this.mapBox(coordinates, zoom);
    }
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
            <div style={style} ref={el => this.mapContainer = el}/>
            <LocationInfo Long={lng} Lat={lat} Zoom={zoom}/>
        </React.Fragment>
      );
    }
}

export default Map;
