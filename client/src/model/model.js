import {Key} from '../config';
import { firebaseConfig } from '../config';

const Model = function () {
  let container = 'Map';
  let observers = [];

  //Searchinput
  let searchInput = '';

  //Date
  let date = new Date();
  let dateParam = getDateString();

  //Geocode
  let location = '';
  let latitude = '';
  let longitude = '';
  let placeName = '';
  let placeOptions = '';
  let coordinates = [5,34];
  let userLocations = {locations:[]};
  let tweetID = '';

  //Tweets
  let tweetAmount = null;
  let tweetsJSON = null;
  let tweets = null;
  // tweet bucket for random draw
  let tweetBucket = null;
  let tweetIndex = null;

  //Sentiment data. Changed to {positive: undefined, negative: undefined}
  let sentimentData = null;

  let searchHistory = {"data": [
    {"id": 1, "query":"#LastWeekTonight", "location": "America", "until": "26-02-18", "dateCreated": "27-02-18", "amount":100, "positive":50, "negative": 25, "neutral":25},
    {"id": 2, "query":"FrenchElection", "location": "Europe", "until": "16-03-18", "dateCreated": "17-03-18", "amount":100, "positive":50, "negative": 25, "neutral":25},
    {"id": 3, "query":"CharlieHebdo", "location": "Europe", "until": "14-05-17", "dateCreated": "15-05-17", "amount":100, "positive":50, "negative": 25, "neutral":25},
    {"id": 4, "query":"@JaneGoodman", "location": "Europe", "until": "05-11-17", "dateCreated": "06-11-17", "amount":100, "positive":50, "negative": 25, "neutral":25},
    {"id": 5, "query":"NATO", "location": "Europe", "until": "26-02-18", "dateCreated": "27-02-18", "amount":100, "positive":50, "negative": 25, "neutral":25},
    {"id": 6, "query":"#SomosJuntos", "location": "South-America", "until": "16-03-18", "dateCreated": "17-03-18", "amount":100, "positive":50, "negative": 25, "neutral":25},
    {"id": 7, "query":"#FindKadyrovsCat", "location": "Europe", "until": "05-11-17", "dateCreated": "06-11-17", "amount":100, "positive":50, "negative": 25, "neutral":25}
  ]};

  // firebase
  let firebase = require("firebase");
  //firebase initialization
  firebase.initializeApp(firebaseConfig);
  //database instantiaton
  var database = firebase.database();

  /*
  * Inserts a search into the database
  */
  this.addSearchToDB = function(positive, negative, noOfNeutral, total){
    let today = new Date();
    let dateCreated = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    let until = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    var search = {
                "query": searchInput,
                "location": placeName,
                "until": until,
                "dateCreated": dateCreated,
                "amount": tweetAmount,
                "positive": positive,
                "negative": negative,
                "noOfNeutral": noOfNeutral,
                "total": total,
                };
    //setup of path to reference the data
    var searchesRef = database.ref("searches");
    var newSearchKey = searchesRef.push(search).key;

    // Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let uid = user.uid;

        let userRef = database.ref("users/"+uid);
        let currUserSearches;
        userRef.once("value")
          .then( (value) => {
            currUserSearches = value.val();

            if (currUserSearches === undefined || currUserSearches === null)
              currUserSearches = [];

            currUserSearches.push(newSearchKey);

            return userRef.set(currUserSearches);
          })
          .then( () => {
            return database.ref("users/"+uid).once("value");
          })
          .then( (value) => {
            console.log(value.val());
          });

      } else {
        user = null;
      }
    });

  }

  /*
  * Gets searches for logged in user
  */
  this.getSearchHistory = function(){

    let currUserSearches;
    return new Promise((resolve, reject)=>{
      firebase.auth().onAuthStateChanged(function(user){
        if(user){
          let uid = user.uid;
          let userRef = database.ref("users/"+uid);

          return userRef.once("value")
          .then( (value) => {
            let currUserSearchesIDs = value.val();

            if(currUserSearchesIDs === null || currUserSearchesIDs === undefined){
              let currUserSearches = null;
              resolve(null);
            }else{
              let currUserSearches = currUserSearchesIDs.map( searchID => {
                return database.ref("searches/"+searchID).once("value")
                    .then( (value) => {
                      let obj = value.val();

                      if (obj){
                        obj["id"] = searchID;
                        return obj;
                      }else{
                        return undefined;
                      }
                    });
              });
              resolve(currUserSearches);
            }
          });
        }else{
          reject("Must log in"); // user must log in
        }
      });
    });
  }

    /*
    * Get search object for provided search ID
    */
   this.getSearchFromDB = function(searchID) {
    return database.ref("searches/"+searchID).once("value").then( (result) => {
      let searchObject = result.val();
      return searchObject;
    });
   }


  this.googleSignIn = function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      notifyObservers("signInSuccess");

    }).catch(function(error) {
      if (error.code === "auth/web-storage-unsupported") {
        console.log("fail XD");
        notifyObservers("signInFailed");
      }
    });
  }

  this.signOut = function () {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
    });
  }

  this.getUserName = function () {
    var user = firebase.auth().currentUser;
    if (user) {
      return (user.displayName.toString());
    }
    else{
      return "Sign in";
    }
  }

  this.getMostPopularTweet = () => {
    let maxRetweets = 0;
    let mostPopularTweetId = null;

    if (tweets !== null) {
      tweets.forEach(function (tweet, index) {
        if (tweet.retweet_count > maxRetweets) {
          maxRetweets = tweet.retweet_count;
          mostPopularTweetId = tweet.id_str;
          tweetIndex = index;
        }
      });
      return mostPopularTweetId;
    }
    else{
      return null
    }
  }

  this.getTweetIndex = () =>{
    return tweetIndex;
  }

  this.getDateString = getDateString;

  function getDateString() {
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    return year+"-"+month+"-"+day;
  }

  // Draw random tweet from bucket and eliminate drawn tweet from bucket
  this.pickTweet = navigate => {
    if (tweets === null) return null;
    let currentTweet = 0;
    if(navigate === 'next'){
      tweetIndex ++;
      currentTweet = tweets[tweetIndex]
    }
    if(navigate === 'previous'){
      tweetIndex --;
      currentTweet = tweets[tweetIndex]
    }
    return currentTweet
    // if (tweetBucket.length === 0) tweetBucket = tweets; // reset bucket if empty
    // let index = Math.floor(Math.random()*tweetBucket.length);
    // let randomTweet = tweetBucket.splice(index, 1)[0];
    // return randomTweet;
  }

  // API Calls
  this.setDate = function(dateIn){
    date = dateIn;
    dateParam = this.getDateString();
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

  this.setSearch = function(search, noNotification){
    searchInput = search;
    if(noNotification){
      return;
    }
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

  this.setPlaceName = function(place){
    placeName = place;
    // console.log(suggestions.places);
    // placeOptions = suggestions.places.map(data => {
    //     // return {label: data.full_name};
    //     return {value: data.full_name, label: data.full_name}
    // });
    notifyObservers('placeNameSet');
  }

  this.getPlaceName = function(){
    return placeName;
  }

  this.getPlaceOptions = function(){
    return placeOptions;
  }

  this.setTweets = function(results){
    // Number of API calls remaining (renews each 15 minutes)
    console.log('Search API calls remaining: ' + results.resp.headers["x-rate-limit-remaining"]); //.x-rate-limit-remaining ["x-rate-limit-remaining"]

    //Set twitter responses
    tweets = results.data.statuses;
    // Set tweet bucket to draw randoms from
    tweetBucket = tweets.slice(0); // copying tweets array
    tweetAmount = results.data.statuses.length;
    this.setUserLocations(results);


    //Build the object to POST to Sentiment Analysis
    const tweetObject = results.data.statuses.map(function(tweet){
      return {"text": tweet.text, "query": searchInput }
    })
    tweetsJSON = JSON.stringify({data: tweetObject})
    notifyObservers('tweetsSet');
  }

  this.setUserLocations = tweets => {
    var coordinates = tweets.data.statuses.reduce((coordinates, tweet) => {
      if(tweet.coordinates !== null){
        // console.log(tweets.indexOf(tweet.id_str));
        coordinates.push({lng: tweet.coordinates.coordinates[0], lat: tweet.coordinates.coordinates[1], id: tweet.id_str}); //, index: tweets.indexOf(tweet)
      }
      return coordinates;
    }, []);
    userLocations = {locations: coordinates}
    notifyObservers('userLocationsSet');
  }

  this.getUserLocations = function(){
    return userLocations;
  }

  this.geoTweetID = function(id){
    tweetID = id;
    notifyObservers('geoIDSet');
  }

  this.getGeoTweetID = function(){
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

  this.setSentimentDataFromTweets = function(tweets){
    sentimentData = this.calculateSentiment(tweets);
    notifyObservers('sentimentSet');
  }

  this.setSentimentData = function(data){
    sentimentData = data;
    notifyObservers("sentimentSet");
  }

  this.getSentimentData = function(){
    return sentimentData;
  }

  this.calculateSentiment = function(results){
    let sentiment = {positive: undefined, negative: undefined, neutral: undefined};
    let pos = 0;
    let neg = 0;
    let neu = 0;

    results.data.map(data =>{
      switch(data.polarity){
        case 4:
          pos += 1
          break
        case 0:
          neg += 1
          break
        case 2:
          neu += 1
          break
      }
    })

    sentiment.positive = (pos/(pos+neg))*100;
    sentiment.negative = (neg/(pos+neg))*100;
    sentiment.noOfNeutral = neu;
    sentiment.total = pos + neg + neu;
    return sentiment;
  }

  this.deleteSearchHistory = function(selectedSearches) {
    /*
    searchHistory.data = searchHistory.data.filter(function(el) {
      return !selectedSearches.includes(el.id);
    });
    */
    notifyObservers();
  }


    this.setErrorMessages = function(error){
      if(error === 'RATE_LIMITED'){
        notifyObservers('rateLimited');
        return
      }
      if(error === 'NO_LOCATION'){
        notifyObservers('locationNotFound');
        return
      }
      if(error === 'ERROR'){
        notifyObservers('networkError');
        return
      }
      if(error === 'NO_SEARCH'){
        notifyObservers('noSearchInputGiven');
        return
      }
      if(error === 'NO_TWEETS'){
        notifyObservers('noTweetsFound');
        return
      }
    }


  //API Calls
  this.searchTweets = function () {
    let url = '/api/twitter/search?'

      if (searchInput !=='') {
        url += 'q=' + encodeURIComponent(searchInput) + '&geocode=' + location + '&until=' + dateParam;
        }
      else{
        notifyObservers('noSearchInputGiven');
      }
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
