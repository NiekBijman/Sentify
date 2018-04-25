import {Key} from '../config';

const httpOptions = {
  headers: {'authorization': Key.getApiKey()},
};

const Model = function () {
  let container = 'Map';
  let observers = [];

  //Searchinput
  let searchInput = '';

  //Date
  let date ='';
  let dateRange = '';

  //Geocode
  let location = '';
  let latitude = '';
  let longitude = '';
  let placeName = 'Global';
  let coordinates = [5,34];

  //Tweets
  let tweets = 0;

  //Sentiment data
  let sentimentData = null;

  let searchHistory = {"data": [
    {"id":1, "subject":"#LastWeekTonight", "continent": "America", "dateStart": "20-02-18", "dateFinish": "26-02-18", "dateCreated": "27-02-18", "downloadPDF": false},
    {"id":2, "subject":"FrenchElection", "continent": "Europe", "dateStart": "10-03-18", "dateFinish": "16-03-18", "dateCreated": "17-03-18", "downloadPDF": true},
    {"id":3, "subject":"CharlieHebdo", "continent": "Europe", "dateStart": "11-05-17", "dateFinish": "14-05-17", "dateCreated": "15-05-17", "downloadPDF": false},
    {"id":4, "subject":"@JaneGoodman", "continent": "Europe", "dateStart": "01-11-17", "dateFinish": "05-11-17", "dateCreated": "06-11-17", "downloadPDF": false},
    {"id":5, "subject":"NATO", "continent": "Europe", "dateStart": "20-02-18", "dateFinish": "26-02-18", "dateCreated": "27-02-18", "downloadPDF": true},
    {"id":6, "subject":"#SomosJuntos", "continent": "South-America", "dateStart": "10-03-18", "dateFinish": "16-03-18", "dateCreated": "17-03-18", "downloadPDF": false},
    {"id":7, "subject":"#FindKadyrovsCat", "continent": "Europe", "dateStart": "01-11-17", "dateFinish": "05-11-17", "dateCreated": "06-11-17", "downloadPDF": true}
  ]};

  // {"data": [{"text": "I love Titanic.", "id":1234, "polarity": 4},
  // {"text": "I love Titanic.", "id":1234, "polarity": 4},
  // {"text": "I don't mind Titanic.", "id":1234, "polarity": 2},
  // {"text": "I like Titanic.", "id":1234, "polarity": 4},
  // {"text": "I hate Titanic.", "id":4567, "polarity": 0}]};


  // API Calls

  this.setContainer = function(input){
    container = input;
    notifyObservers();
  }

  this.getContainer = function(){
    return container;
  }

  this.setSearch = function(search){
    searchInput = search;
    notifyObservers();
  }

  this.getSearch = function(){
    return searchInput;
  }

  this.setGeocode = function(geocode){
    location = geocode;
    notifyObservers('geoCodeSet');
  }

  this.getGeocode = () => {
    return location;
  }

  this.setCoordinates = (lng, lat ) =>{
    coordinates = [lng, lat];
    // location
    console.log()
    notifyObservers('jumpToCoordinates');
  }

  this.getCoordinates = () => {
    return coordinates;
  }

  this.setLatLng = function(lat, lng){
    latitude = lat;
    longitude = lng;
  }

  this.setPlaceName = function(string){
    placeName = string;
    notifyObservers('placeNameSet');
  }

  this.getPlaceName = function(){
    return placeName;
  }

  this.getTweetAmount = function(){
    return tweets;
  }

  this.setSentimentData = function(result){
    sentimentData = result;
    tweets = result.tweets.data.length;
    notifyObservers('tweetSearch');
  }

  this.getSentimentData = function(){
    return sentimentData;
  }

  this.getSearchHistory = function() {
    return searchHistory;
  }

  this.deleteSearchHistory = function(selectedSearches) {
    searchHistory.data = searchHistory.data.filter(function(el) {
      return !selectedSearches.includes(el.id);
    });
    notifyObservers();
  }

  // API Calls
  this.sentimentAnalysis = function () {
    // const url = 'http://www.sentiment140.com/api/bulkClassifyJson' + searchInput //TO DO: Fix correct URL
    // return fetch(url, httpOptions)
    //   .then(processResponse)
    //   .catch(handleError)
  }

  this.searchTweets = function () {
    const url = '/api/sentiment?' + 'q=' + searchInput + '&geocode=' + location; //+ 'geocode=' + location;
    // const url = 'search/tweets?' + 'q=' + searchInput + 'geocode=' + location;
    notifyObservers();
    return fetch(url, httpOptions)
      .then(processResponse)
      .catch(handleError)
  }

  this.reverseGeocode = function () {
    const url = '/api/twitter/reverse_geocode?' + 'lat=' + latitude + '&long=' + longitude;
    return fetch(url)
      .then(processResponse)
      .catch(handleError)
  }

  this.geocode = () => {
    const url = '/api/twitter/geocode?' + 'query=' + encodeURIComponent(placeName);
    return fetch(url)
      .then(processResponse)
      .catch(handleError)
  }

  // API Helper methods
  const processResponse = function (response) {
    if (response.ok) {
      return response.json()
    }
    throw response;
  }

  const handleError = function (error) {
    if (error.json) {
      error.json().then(error => {
        console.error('API Error:', error.message || error)
      })
    } else {
      console.error('API Error:', error.message || error)
    }
  }

  // Observer pattern
  this.addObserver = function (observer) {
    observers.push(observer);
  };

  this.removeObserver = function (observer) {
    observers = observers.filter(o => o !== observer);
  };

  const notifyObservers = function (details) {
    observers.forEach(o => o.update(details));
  };
};

export const modelInstance = new Model();
