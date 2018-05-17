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
  let allTweets = [];
  let positiveTweets = [];
  let negativeTweets = [];
  let chartPolarity = '';
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

  this.setMySearchesParams = function(searchObject) {
    localStorage.setItem("mySearchesObject", JSON.stringify(searchObject));
  };

  this.getMySearchesParams = function(){
    let searchObjectStr = localStorage.getItem("mySearchesObject");
    let searchObject = JSON.parse(searchObjectStr);
    localStorage.removeItem("mySearchesObject");
    return searchObject;
  };

  this.setSearchParamsFromLocalStorage = function(){
    this.setSearch(localStorage.getItem("searchInput"));
    this.setGeocode(localStorage.getItem("location"));
    this.setDate(new Date(localStorage.getItem("date")));
    this.setPlaceName(localStorage.getItem("placeName"));
    let coordinates = JSON.parse(localStorage.getItem("coordinates"));
    
  }
  this.getStoredCoordinates = function () {
    let coordinates = JSON.parse(localStorage.getItem("coordinates"));
    if (coordinates){
      return coordinates;
    }
    return null;
  }

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


   this.deleteSearchHistory = function(selectedSearches) {
     //setup of path to reference the data
     var searchesRef = database.ref("searches");
     selectedSearches.forEach( search => {
       //Remove selected searches
       searchesRef.child(search).remove()
     });
     notifyObservers("searchesDeleted");
   }


  this.googleSignIn = function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      notifyObservers("signInSuccess");

    }).catch(function(error) {
      if (error.code === "auth/web-storage-unsupported") {
        notifyObservers("signInFailed");
      }
    });
  }

  this.signOut = function () {
    firebase.auth().signOut().then( message => {
        // Sign-out successful.
        console.log(message);
        notifyObservers("signOutSucceeded");
      }).catch(function(error) {
        // An error happened.
        console.log(error);
    });
  }

  this.getSignInStatus = function () {
    return new Promise((resolve, reject)=>{
      firebase.auth().onAuthStateChanged(function(user){
        if (user){
          resolve(user);
        }
        else {
          resolve(false);
        }
      });
    });
  }

  this.getUserName = function () {
    var user = firebase.auth().currentUser;
    if (user !== null) {
      if(user.displayName !== null){
        return (user.displayName.toString());
      }
      return "Logged In";
    }
    else{
      return "Sign in";
    }
  }

  this.getMostPopularTweet = () => {
    let maxRetweets = 0;
    let mostPopularTweetId = null;

    if (tweets !== null) {
      if(tweets.length === 1 ) {
        mostPopularTweetId = tweets[0].id_str
        return mostPopularTweetId;
      }
      if(tweets.length > 1 ) {
        tweets.forEach(function (tweet, index) {
          if (tweet.retweet_count > maxRetweets) {
            maxRetweets = tweet.retweet_count;
            mostPopularTweetId = tweet.id_str;
            tweetIndex = index;

          }
        });
        return mostPopularTweetId;
      }
    }
    else{
      return null
    }
  }

  this.getTweetIndex = () => {
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
    let maxTweets = (tweets.length -1);
    if(navigate === 'next'){
      if(tweetIndex === maxTweets){
        tweetIndex = 0;
      }
      else{
        tweetIndex ++;
      }
      currentTweet = tweets[tweetIndex]
    }
    if(navigate === 'previous'){
      if(tweetIndex === 0){
        tweetIndex = maxTweets;
      }
      else{
        tweetIndex --;
      }
      currentTweet = tweets[tweetIndex]
    }
    return currentTweet
  }

  this.setChartTweets = polarity => {
    chartPolarity = polarity;
    if(tweets !== null) {
      if(polarity === 'Positive' && positiveTweets.length !== 0){
        tweets = positiveTweets
      }
      else if(polarity === 'Negative' && negativeTweets.length !== 0){
        tweets = negativeTweets
      }
      else if(polarity === 'All'){
        tweets = allTweets
      }
      notifyObservers("chartTweetsSet");
    }
    else{
      notifyObservers("noSearchInputGiven");
    }
    // console.log(tweetIndex)
  }

  this.getChartPolarity = () => {
      return chartPolarity
  }

  // API Calls
  this.setDate = function(dateIn){
    date = dateIn;
    dateParam = this.getDateString();

    localStorage.setItem("date", date);
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
      notifyObservers("searchInputSet-NoSearch");
      return;
    }
    localStorage.setItem("searchInput", searchInput);
    notifyObservers("searchInputSet");
  }

  this.getSearch = function(){
    return searchInput;
  }

  this.setGeocode = function(geocode){
    location = geocode;
    if (location !== null){
      localStorage.setItem("location", location);
    }
    notifyObservers('geoCodeSet');
  }

  this.getGeocode = () => {
    return location;
  }

  this.setCoordinates = (lng, lat ) =>{
    coordinates = [lng, lat];
    localStorage.setItem("coordinates", JSON.stringify(coordinates));
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

  this.setPlaceName = function(place, noNotification){
    placeName = place;
    if(placeName){
      console.log("setting placeName to ");
      console.log(placeName);
      localStorage.setItem("placeName", placeName);
    }
    if(noNotification){
      notifyObservers("placeNameSet-NoSearch");
      return;
    }
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

    // First we filter our retweets to avoid duplicate tweets in the Sentiment Analysis
    // tweets = results.data.statuses.filter(tweet => {
    //   if (tweet.retweeted_status === undefined) {
    //     return true;
    //   }
    //   else{
    //     return false;
    //   }
    // });
    tweets = results.data.statuses;
    allTweets = tweets;
    chartPolarity = 'All';
    tweetAmount = tweets.length;
    this.setUserLocations(results);


    //Build the object to POST to Sentiment Analysis
    const tweetObject = tweets.map(function(tweet){
      return {"text": tweet.text, "query": searchInput, "retweet_count": tweet.retweet_count, "id_str": tweet.id_str}
    })
    tweetsJSON = JSON.stringify({data: tweetObject})
    notifyObservers('tweetsSet');
  }

  this.setUserLocations = tweets => {
    var coordinates = tweets.data.statuses.reduce((coordinates, tweet) => {
      if(tweet.coordinates !== null){
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

  this.setSentimentData = function(tweets){
    sentimentData = this.calculateSentiment(tweets);
    notifyObservers('sentimentSet');
  }

  this.getSentimentData = function(){
    return sentimentData;
  }

  this.calculateSentiment = function(results){
    let sentiment = {positive: undefined, negative: undefined, neutral: undefined};
    let pos = 0;
    let neg = 0;
    let neu = 0;
    positiveTweets = [];
    negativeTweets = [];

    results.data.map(data =>{
      switch(data.polarity){
        case 4:
          pos += 1
          positiveTweets.push({retweet_count: data.retweet_count, id_str: data.id_str})
          break
        case 0:
          neg += 1
          negativeTweets.push({retweet_count: data.retweet_count, id_str: data.id_str})
          break
        case 2:
          neu += 1
          break
      }
    })

    if(pos === 0 && neg === 0){
      notifyObservers("noSentimentFound");
    }

    sentiment.positive = (pos/(pos+neg))*100;
    sentiment.negative = (neg/(pos+neg))*100;
    sentiment.noOfNeutral = neu;
    sentiment.total = pos + neg + neu;
    return sentiment;
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
      if(error === 'LOGIN_REQUIRED'){
        notifyObservers('pleaseLogIn');
        return
      }
    }


  //API Calls
  this.searchTweets = function () {
    let url = '/api/twitter/search?'

      if (searchInput !=='') {
        url += 'q=' + encodeURIComponent(searchInput) + '&geocode=' + (location ? location : "") + '&until=' + (dateParam ? dateParam : "");
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
