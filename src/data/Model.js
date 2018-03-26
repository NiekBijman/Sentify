const httpOptions = {
  headers: {'X-Mashape-Key': 'YOUR_API_KEY'}
};

const Model = function () {
  let container = 'Map';
  let observers = [];



  // API Calls

  this.setContainer = function(input){
    let container = input;
    notifyObservers();
  }

  this.getContainer = function(){
    return container;
  }

  // this.getMap = function() {
  //     var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
  //     mapboxgl.accessToken = 'pk.eyJ1Ijoibmlla2Jpam1hbiIsImEiOiJjamY0MnN2NXkxaGpjMzRwZHloM3FoZG9uIn0.eZBRbD2LO-4yNS-gXVtRag';
  //     var map = new mapboxgl.Map({
  //       container: this.getContainer(),
  //       style: 'mapbox://styles/mapbox/streets-v10'
  //     });
  // }

  // Observer pattern

  this.addObserver = function (observer) {
    observers.push(observer);
  };

  this.removeObserver = function (observer) {
    observers = observers.filter(o => o !== observer);
  };

  const notifyObservers = function () {
    observers.forEach(o => o.update());
  };
};

export const modelInstance = new Model();
