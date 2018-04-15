import {Key} from '../config';

const httpOptions = {
  headers: {'authorization': Key.getApiKey()},
};

const Model = function () {
  let container = 'Map';
  let observers = [];
  let searchInput = '';
  let sentimentData = null;


  // {"data": [{"text": "I love Titanic.", "id":1234, "polarity": 4},
  // {"text": "I love Titanic.", "id":1234, "polarity": 4},
  // {"text": "I don't mind Titanic.", "id":1234, "polarity": 2},
  // {"text": "I like Titanic.", "id":1234, "polarity": 4},
  // {"text": "I hate Titanic.", "id":4567, "polarity": 0}]};


  // API Calls

  this.setContainer = function(input){
    let container = input;
    notifyObservers();
  }

  this.getContainer = function(){
    return container;
  }

  this.setSearch = function(search){
    searchInput = search
  }

  this.getSearch = function(){
    return searchInput;
  }

  this.setSentimentData = function(result){
    sentimentData = result;
    notifyObservers('tweetSearch');
  }

  this.getSentimentData = function(){
    return sentimentData;
  }

  // API Calls
  this.sentimentAnalysis = function () {
    // const url = 'http://www.sentiment140.com/api/bulkClassifyJson' + searchInput //TO DO: Fix correct URL
    // return fetch(url, httpOptions)
    //   .then(processResponse)
    //   .catch(handleError)
  }

  this.searchTweets = function () {
    const url = '/api/sentiment?q=' + searchInput
    return fetch(url, httpOptions)
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

  const notifyObservers = function () {
    observers.forEach(o => o.update());
  };
};

export const modelInstance = new Model();
