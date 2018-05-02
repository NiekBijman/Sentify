import {Key} from '../config';



const Model = function () {
  let container = 'Map';
  let observers = [];

  //Searchinput
  let searchInput = '';

  //Date
  let date = new Date();
  let dateRange = '';

  //Geocode
  let location = '';
  let latitude = '';
  let longitude = '';
  let placeName = '';
  let coordinates = [5,34];
  let userLocations = {locations:[]};
  let userId = '';

  //Tweets
  let tweetAmount = null;
  let tweetsJSON = null;
  let tweets = null;

  //Sentiment data
  let sentimentData = null;

  let searchHistory = {"data": [
    {"id":1, "subject":"#LastWeekTonight", "Location": "America", "dateStart": "20-02-18", "dateFinish": "26-02-18", "dateCreated": "27-02-18", "downloadPDF": false},
    {"id":2, "subject":"FrenchElection", "Location": "Europe", "dateStart": "10-03-18", "dateFinish": "16-03-18", "dateCreated": "17-03-18", "downloadPDF": true},
    {"id":3, "subject":"CharlieHebdo", "Location": "Europe", "dateStart": "11-05-17", "dateFinish": "14-05-17", "dateCreated": "15-05-17", "downloadPDF": false},
    {"id":4, "subject":"@JaneGoodman", "Location": "Europe", "dateStart": "01-11-17", "dateFinish": "05-11-17", "dateCreated": "06-11-17", "downloadPDF": false},
    {"id":5, "subject":"NATO", "Location": "Europe", "dateStart": "20-02-18", "dateFinish": "26-02-18", "dateCreated": "27-02-18", "downloadPDF": true},
    {"id":6, "subject":"#SomosJuntos", "Location": "South-America", "dateStart": "10-03-18", "dateFinish": "16-03-18", "dateCreated": "17-03-18", "downloadPDF": false},
    {"id":7, "subject":"#FindKadyrovsCat", "Location": "Europe", "dateStart": "01-11-17", "dateFinish": "05-11-17", "dateCreated": "06-11-17", "downloadPDF": true}
  ]};

  // {"data": [{"text": "I love Titanic.", "id":1234, "polarity": 4},
  // {"text": "I love Titanic.", "id":1234, "polarity": 4},
  // {"text": "I don't mind Titanic.", "id":1234, "polarity": 2},
  // {"text": "I like Titanic.", "id":1234, "polarity": 4},
  // {"text": "I hate Titanic.", "id":4567, "polarity": 0}]};


  // API Calls

  this.setDate = function(dateIn){
    date = dateIn;
    notifyObservers("dateSet");
  }
  this.getDate = function(){
    return date;
  }

  this.setContainer = function(input){
    container = input;
    notifyObservers();
  }

  this.getContainer = function(){
    return container;
  }

  this.setSearch = function(search){
    searchInput = search;
    notifyObservers("searchInputSet");
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

  this.getDateString = () => {
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    return year+"-"+month+"-"+day;
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
    if(string === 'error'){
      notifyObservers('rateLimited');
      return
    }
    placeName = string;
    notifyObservers('placeNameSet');
  }

  this.getPlaceName = function(){
    return placeName;
  }

  this.setTweets = function(results){
    // if (results === null){
    //   tweets = null;
    //   tweetAmount = 0;
    //   return;
    // }

    if(results.data.statuses.length === 0){
      notifyObservers('emptySearch');
      return
    }

    //Set twitter responses
    tweets = results.data.statuses
    tweetAmount = results.data.statuses.length;
    this.setUserLocations(results);


    //Build the object to POST to Sentiment Analysis
    const tweetObject = results.data.statuses.map(function(tweet){
      return {"text": tweet.text}
    })
    tweetsJSON = JSON.stringify({data: tweetObject})
    notifyObservers('tweetsSet');
  }

  this.setUserLocations = tweets => {
    // if (tweets === null){
    //   userLocations = null;
    //   return;
    // }
    var coordinates = tweets.data.statuses.reduce((coordinates, tweet) => {
      if(tweet.coordinates !== null){
        coordinates.push({lng: tweet.coordinates.coordinates[0], lat: tweet.coordinates.coordinates[1], id: tweet.id_str});
      }
      return coordinates;
    }, []);
    userLocations = {locations: coordinates}
    notifyObservers('userLocationsSet');
  }

  this.getUserLocations = function(){
    return userLocations;
  }

  this.setUserId = function(id){
    userId = id;
    console.log(userId);
    notifyObservers('userIdSet');
  }

  this.getUserId = function(){
    return userId;
  }

  this.resetPlaceName = function(){
    placeName = '';
    location = '';
    notifyObservers('placeNameReset');
  }

  this.getTweetAmount = function(){
    return tweetAmount;
  }

  this.getTweets = function() {
    return tweets;
  }

  this.setSentimentData = function(results){
    sentimentData = results;
    notifyObservers('sentimentSet');
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

  this.getMostPopularTweet = () => {
    let maxRetweets = 0;
    let mostPopularTweetId = null;

    if (tweets !== null) {
      tweets.forEach(function (tweet, index) {
        if (tweet.retweet_count > maxRetweets) {
          maxRetweets = tweet.retweet_count;
          mostPopularTweetId = tweet.id;
        }
      });
      return mostPopularTweetId.toString();
    }
  }

  //API Calls
  this.searchTweets = function () {
    let year = date.getFullYear();
    let month = date.getMonth()+1; // January is 0 in js
    let day = date.getDate();
    let dateParam = year+"-"+month+"-"+day;
    const url = '/api/twitter/search?' + 'q=' + searchInput + '&geocode=' + location + "&until=" + dateParam; //+ 'geocode=' + location;
    // const url = 'search/tweets?' + 'q=' + searchInput + 'geocode=' + location;

    console.log(url);
    return fetch(url)
      .then(processResponse)
      .catch(handleError)
  }

  this.analyzeSentiment = function () {
    const url = '/api/sentiment' + '?appid=bijman@kth.se';
    notifyObservers();
    return fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
        body: tweetsJSON
      })
      .then(processResponse)
      .catch(handleError)
  }

  const httpOptions = {
    method: "POST",
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    body: {data: tweets}
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

  const handleError = async function (error) {
    if (error instanceof Response) {
      if(error.headers.get("content-type").includes("application/json"))
        error = await error.json();
      else error = await error.text();
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
