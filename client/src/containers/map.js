import React from 'react';
import mapboxgl from 'mapbox-gl';
import * as d3 from "d3";
import DrawCircle from '../components/map-draw'
import LocationInfo from '../components/map-location-info';
import '../styles/map.css';
import { modelInstance } from '../model/model';

class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      coordinates: modelInstance.getCoordinates(),
      lng: modelInstance.getCoordinates()[0],
      lat: modelInstance.getCoordinates()[1],
      zoom: 1.5,
      userLocations: modelInstance.getUserLocations(),//{locations:[{lng: 5, lat:34}, {lng:20, lat:15}]}
      svg: '',
      map: ''
    };
  }

  componentDidMount() {
      modelInstance.addObserver(this);
      // check if there are coordinates in localStorage
      let coords = modelInstance.getStoredCoordinates();
      if (coords){
        this.mapBox(coords, 7);
      } else {
        this.mapBox(this.state.coordinates, this.state.zoom);
      }
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
          var userLocations = this.state.userLocations

          var active = true;
          var circleControl = new DrawCircle(svg, userLocations)
            .projection(project)
            .inverseProjection(function(a) {
              return map.unproject({x: a[0], y: a[1]});
            })
            .activate(active)

          this.setState({
            svg: svg,
            circleControl: circleControl,
            map: map
          })

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

            const { lng, lat } = map.getCenter();
            this.circleRender(circleControl, svg, this.state.userLocations)


            this.setState({
              lng: lng.toFixed(4),
              lat: lat.toFixed(4),
              zoom: map.getZoom().toFixed(2)
            });
          })

          // render our initial visualization
          this.circleRender(circleControl, svg, this.state.userLocations)

      }

  circleRender(circleControl, svg, userLocations) {
    circleControl.update(svg, userLocations)
    // console.log(circleControl,svg, userLocations);
  }

  update(details) {
    if(details ==='jumpToCoordinates'){
      var coordinates = modelInstance.getCoordinates();
      var zoom = 8;

      //Remove old map and create new one using new coordinates
      this.state.map.remove()
      this.mapBox(coordinates, zoom);
    }
    if(details ==='userLocationsSet'){
      let circleControl = this.state.circleControl;
      let svg = this.state.svg;
      let locations = modelInstance.getUserLocations();
      this.setState({
        userLocations: locations
      })
      this.circleRender(circleControl, svg, locations)
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
