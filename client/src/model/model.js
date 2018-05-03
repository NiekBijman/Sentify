import {Key} from '../config';
import { firebaseConfig } from '../config';

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
  let tweetID = '';

  //Tweets
  let tweetAmount = null;
  let tweetsJSON = null;
  let tweets = null;
  // tweet bucket for random draw
  let tweetBucket = null;

  //Sentiment data
  let sentimentData = null;

  let searchHistory = {"data": [
    {"query":"#LastWeekTonight", "location": "America", "until": "26-02-18", "dateCreated": "27-02-18", "amount":100, "positive":50, "negative": 25, "neutral":25},
    {"query":"FrenchElection", "location": "Europe", "until": "16-03-18", "dateCreated": "17-03-18", "amount":100, "positive":50, "negative": 25, "neutral":25},
    {"query":"CharlieHebdo", "location": "Europe", "until": "14-05-17", "dateCreated": "15-05-17", "amount":100, "positive":50, "negative": 25, "neutral":25},
    {"query":"@JaneGoodman", "location": "Europe", "until": "05-11-17", "dateCreated": "06-11-17", "amount":100, "positive":50, "negative": 25, "neutral":25},
    {"query":"NATO", "location": "Europe", "until": "26-02-18", "dateCreated": "27-02-18", "amount":100, "positive":50, "negative": 25, "neutral":25},
    {"query":"#SomosJuntos", "location": "South-America", "until": "16-03-18", "dateCreated": "17-03-18", "amount":100, "positive":50, "negative": 25, "neutral":25},
    {"query":"#FindKadyrovsCat", "location": "Europe", "until": "05-11-17", "dateCreated": "06-11-17", "amount":100, "positive":50, "negative": 25, "neutral":25}
  ]};

  // firebase
  var firebase = require("firebase");
  //firebase initialization
  firebase.initializeApp(firebaseConfig);
  //database instiation
  var database = firebase.database();

  /*
  * Inserts a search into the database
  */
  this.addSearchToDB = function(positive, negative, neutral){
    let today = new Date();
    let dateCreated = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    var search = {
                "query": searchInput,
                "location": location,
                "until": date,
                "dateCreated": dateCreated,
                "amount": tweetAmount,
                "positive": positive,
                "negative": negative,
                "neutral": neutral
                };
    //setup of path to reference the data
    var searchesRef = database.ref("searches");
    var newSearchRef = searchesRef.push(search);

    let user = firebase.auth().currentUser;
    let uid = user.uid;

    let userRef = database.ref("users/"+uid);
    let currUserSearches;
    userRef.once("value").then( (value) => {
      currUserSearches = value;
    });
    console.log("Current user searches");
    console.log(currUserSearches);
    if (currUserSearches === undefined)
      currUserSearches = [];
    currUserSearches.push(search);
    // TODO: store new search in users/uid/
  }

  // {"data": [{"text": "I love Titanic.", "id":1234, "polarity": 4},
  // {"text": "I love Titanic.", "id":1234, "polarity": 4},
  // {"text": "I don't mind Titanic.", "id":1234, "polarity": 2},
  // {"text": "I like Titanic.", "id":1234, "polarity": 4},
  // {"text": "I hate Titanic.", "id":4567, "polarity": 0}]};

  // Draw random tweet from bucket and eliminate drawn tweet from bucket
  this.randomDrawTweet = function(){
    if (tweetBucket === null) return null;
    if (tweetBucket.length === 0) tweetBucket = tweets; // reset bucket if empty
    let index = Math.floor(Math.random()*tweetBucket.length);
    let randomTweet = tweetBucket.splice(index, 1)[0];
    return randomTweet;
  }

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
    if(results.data.statuses.length === 0){
      notifyObservers('emptySearch');
      return
    }

    //Set twitter responses
    tweets = results.data.statuses;
    // Set tweet bucket to draw randoms from
    tweetBucket = tweets.slice(0); // copying tweets array
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

  this.setTweetID = function(id){
    tweetID = id;
    notifyObservers('tweetIDSet');
  }

  this.getTweetID = function(){
    return tweetID;
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
    let url = '/api/twitter/search?' + 'q=' + encodeURIComponent(searchInput) 
    if (location !== "")
      url += '&geocode=' + location;
  
    let year = date.getFullYear();
    let month = date.getMonth()+1; // January is 0 in js
    let day = date.getDate();
    let dateParam = year+"-"+month+"-"+day;

    url += "&until=" + dateParam; 

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
