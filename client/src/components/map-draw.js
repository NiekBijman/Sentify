import * as d3 from "d3";
import { modelInstance } from '../model/model';
import {debounce} from 'throttle-debounce';

const DrawCircle = (svg, locations) => {
  let circleCenter, circleOuter; //control points
  let circleSelected = false; //have we completed the circle?
  let circleClicked =false; //did the user click on the circle or the map?
  let dragging = false; //track whether we are dragging
  let active = false; // user can turn on/off this behavior
  let doubleClicked = false;
  let container = svg; // the container we render our points in
  let userLocations = locations

  // this will likely be overriden by leaflet projection
  let project = d3.geo.mercator();
  let unproject = d3.geo.mercator().invert;

  //we expose events on our component
  let dispatch = d3.dispatch("update","clear");

  this.geoCode = debounce(1000, this.geoCode);

  // The user provides an svg element to listen on events
  svg.on("click", function() {
    if(!active) return;
    if(dragging && circleSelected) return;

    let p = d3.mouse(this);
    let ll = unproject([p[0],p[1]]);

    if(circleCenter) {
      // if we already have the circle's center and the circle
      // is finished selecting, another click means destroy the circle
        if(!circleSelected) {
          // Set the outer point
          circleOuter = ll;
          circleSelected = true;
          circleClicked = true;
        }
        else{
          circleClicked = false;
        }
      }
    else {
      // We set the center to the initial click
      circleCenter = ll;
      circleOuter = ll;
    }

    // if(circleSelected){
    //   console.log('Distance = ' + calcDist(circleCenter, circleOuter).toFixed(0) + ' km');
    // }
    if(!doubleClicked){
      //Search the place name for this coordinate
      reverseGeocode(circleCenter.lat, circleCenter.lng);
    }


    if(circleCenter) {
      //Setting geocode as a parameter for Search Tweets
      geoCode(circleCenter.lat, circleCenter.lng, calcDist(circleCenter, circleOuter));
    }

    doubleClicked = false;
    update()
  })

  svg.on("dblclick",function(){
    // start over
    circleCenter = null;
    circleOuter = null;
    circleSelected = false;
    doubleClicked = true;
    container.selectAll("circle.lasso").remove();
    container.selectAll("circle.control").remove();
    container.selectAll("line.lasso").remove();
    container.selectAll("circle.dot").remove();

    dispatch.clear();
   });

  svg.on("mousemove.circle", function() {
    if(!active) return;
    if(circleSelected) return;
    // we draw a guideline for where the next point would go.
    let p = d3.mouse(this);
    let ll = unproject([p[0],p[1]])
    circleOuter = ll;
    update();
  })

  let drag = d3.behavior.drag()
    .on('dragstart', function(){
      d3.event.sourceEvent.stopPropagation();
    })
    .on("drag", function(d,i) {
      if(!active) return;
      if(circleSelected) {
        container.selectAll("circle.dot").remove();
        dragging = true;
        let p = d3.mouse(svg.node());
        let ll = unproject([p[0],p[1]])
        if(i) {
          circleOuter = ll;
        } else {
          let dlat = circleCenter.lat - ll.lat;
          let dlng = circleCenter.lng - ll.lng;
          circleCenter = ll;
          circleOuter.lat -= dlat;
          circleOuter.lng -= dlng;
        }
        geoCode(circleCenter.lat, circleCenter.lng, calcDist(circleCenter, circleOuter));

        update();
      } else {
        return false;
      }
    })
    // .on("dragend", function(d) {
    //   kind of a dirty hack...
    //   setTimeout(function() {
    //     dragging = false;
    //   },100)
    // })


  function update(g, users) {
    if(g) container = g;
    if(users) userLocations = users;
    // console.log(userLocations);
    if(!circleCenter || !circleOuter) return;
    let dist = distance(circleCenter, circleOuter)
    let circleLasso = container.selectAll("circle.lasso").data([dist])
    circleLasso.enter().append("circle").classed("lasso", true)
    .on("click", function() {
      if(!active) return;
      d3.event.stopPropagation();
      // start over
      circleCenter = null;
      circleOuter = null;
      circleSelected = false;
      container.selectAll("circle.lasso").remove();
      container.selectAll("circle.control").remove();
      container.selectAll("line.lasso").remove();
      container.selectAll("circle.dot").remove();

      dispatch.clear();
    }).on('mouseenter', function() {
      if(!active) return;
      circleLasso.style({
        fill: "#f44242",
        "fill-opacity": 0.5
      })
    }).on("mouseover", function() {
        d3.select(this).style("cursor", "pointer");
    }).on('mouseleave', function() {
      if(!active) return;
      circleLasso.style({
        fill: "#6b6b6b",
        "fill-opacity": 0.1
      })
    })

    circleLasso
    .attr({
      cx: project(circleCenter).x,
      cy: project(circleCenter).y,
      r: dist
    })
    .style({
      stroke: "#6b6b6b",
      fill: "#6b6b6b",
      "fill-opacity": 0.1
    })

    // LINE (radius)

    let line = container.selectAll("line.lasso").data([circleOuter])
    line.enter().append("line").classed("lasso", true)

    if(!circleSelected && circleCenter || dragging) {
      line.attr({
        x1: project(circleCenter).x,
        y1: project(circleCenter).y,
        x2: project(circleOuter).x,
        y2: project(circleOuter).y
      })
      .style({
        stroke: "#111",
        "stroke-dasharray": "5 5"
      })
    } else {
      line.remove();
    }

    // CIRCLE CONTROLS

    let controls = container.selectAll("circle.control")
    .data([circleCenter, circleOuter])
    controls.enter().append("circle").classed("control", true)
    controls.attr({
      cx: function(d) { return project(d).x},
      cy: function(d) { return project(d).y},
      r: 4,
      // stroke: "#010",
      fill: "#ff5454",
      "fill-opacity":0.9
    })
    .style({
      "cursor": active ? "move" : null
    })
    .call(drag)


    // USER LOCATIONS

    if(userLocations.length !== 0){

      let dots = container.selectAll("circle.dot")
        .data(userLocations.locations)

      // console.log(userLocations)
      dots.enter().append("circle").classed("dot", true)
      .attr("r", 1)
      .style({
          fill: "#0082a3",
          "fill-opacity": 0.6,
          // stroke: "#004d60"
      })
      .transition().duration(1000)
      .attr("r", 6)


      dots.attr({
        cx: function(d) {
          var x = project(d).x;
          return x
        },
        cy: function(d) {
          var y = project(d).y;
          return y
        },
      })
      .on('mouseenter', function() {
        if(!active) return;
        dots.transition().duration(200)
        .attr("r", 8)
        .style({
          fill: "#ff5454",
          "fill-opacity":0.9
        })

        d3.select(this).style("cursor", "pointer");
      })
      .on('mouseleave', function() {
        dots.transition().duration(200)
        .attr("r", 6)
        .style({
            fill: "#0082a3",
            "fill-opacity": 0.6,
            // stroke: "#004d60"
        })
      })

      dots.on('click', element => {
        modelInstance.setUserId(element.id);
      })
    }


    dispatch.update();
  }
  this.update = update;

  this.projection = function(val) {
    if(!val) return project;
    project = val;
    return this;
  }
  this.inverseProjection = function(val) {
    if(!val) return unproject;
    unproject = val;
    return this;
  }
  this.activate = function(val) {
    active = val;
    return this;
  }
  this.distance = function(ll) {
    if(!ll) ll = circleOuter;
    // console.log(distance(circleCenter, ll))
    return distance(circleCenter, ll)
  }

  function distance(ll0, ll1) {
    let p0 = project(ll0)
    let p1 = project(ll1)
    let dist = Math.sqrt((p1.x - p0.x)*(p1.x - p0.x) + (p1.y - p0.y)*(p1.y-p0.y))
    return dist;
  }

  // Calculating distance between 2 coordinates using the Haversine Formula
  function calcDist (mC, cC) {
      let dLatRad = Math.abs(mC.lat - cC.lat) * Math.PI/180;
      let dlngRad = Math.abs(mC.lng - cC.lng) * Math.PI/180;
      // Calculate origin in Radians
      let lat1Rad = mC.lat * Math.PI/180;
      let lng1Rad = mC.lng * Math.PI/180;
      // Calculate new point in Radians
      let lat2Rad = cC.lat * Math.PI/180;
      let lng2Rad = cC.lng * Math.PI/180;

      // Earth's Radius
      let eR = 6371;

      let d1 = Math.sin(dLatRad/2) * Math.sin(dLatRad/2) +
         Math.sin(dlngRad/2) * Math.sin(dlngRad/2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
      let d2 = 2 * Math.atan2(Math.sqrt(d1), Math.sqrt(1-d1));

      return(eR * d2);
   }

  function geoCode (lat, lng, distance) {
    if(circleSelected && circleClicked){
      let location = lat.toFixed(6) + ',' + lng.toFixed(6) + ',' + distance.toFixed(0) + 'km';
      console.log(location);
      modelInstance.setGeocode(location);
      return location
    }
  }

  function reverseGeocode (lat, lng){
    if(circleCenter && !circleSelected ){
      modelInstance.setLatLng(lat.toFixed(6), lng.toFixed(6));
      modelInstance.reverseGeocode(lat, lng).then(result => {
        console.log(result[0].full_name);
        modelInstance.setPlaceName(result[0].full_name);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  d3.rebind(this, dispatch, "on")
  return this;
}

export default DrawCircle
