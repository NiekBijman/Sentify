import {Key} from '../config';

const httpOptions = {
  headers: {'authorization': Key.getApiKey()},
};

const Model = function () {
  let container = 'Map';
  let observers = [];
  let searchInput = '';
  let sentimentData = {"data": [{"text": "I love Titanic.", "id":1234, "polarity": 4},
                      {"text": "I love Titanic.", "id":1234, "polarity": 4},
                      {"text": "I don't mind Titanic.", "id":1234, "polarity": 2},
                      {"text": "I like Titanic.", "id":1234, "polarity": 4},
                      {"text": "I hate Titanic.", "id":4567, "polarity": 0}]};

  let searchHistory = {"data": [
    {"id":1, "subject":"#LastWeekTonight", "continent": "America", "dateStart": "20-02-18", "dateFinish": "26-02-18", "dateCreated": "27-02-18", "downloadPDF": false},
    {"id":2, "subject":"FrenchElection", "continent": "Europe", "dateStart": "10-03-18", "dateFinish": "16-03-18", "dateCreated": "17-03-18", "downloadPDF": true},
    {"id":3, "subject":"CharlieHebdo", "continent": "Europe", "dateStart": "11-05-17", "dateFinish": "14-05-17", "dateCreated": "15-05-17", "downloadPDF": false},
    {"id":4, "subject":"@JaneGoodman", "continent": "Europe", "dateStart": "01-11-17", "dateFinish": "05-11-17", "dateCreated": "06-11-17", "downloadPDF": false},
    {"id":5, "subject":"NATO", "continent": "Europe", "dateStart": "20-02-18", "dateFinish": "26-02-18", "dateCreated": "27-02-18", "downloadPDF": true},
    {"id":6, "subject":"#SomosJuntos", "continent": "South-America", "dateStart": "10-03-18", "dateFinish": "16-03-18", "dateCreated": "17-03-18", "downloadPDF": false},
    {"id":7, "subject":"#FindKadyrovsCat", "continent": "Europe", "dateStart": "01-11-17", "dateFinish": "05-11-17", "dateCreated": "06-11-17", "downloadPDF": true}
  ]};


  // API Calls

  this.setContainer = function(input){
    let container = input;
    notifyObservers();
  }

  this.getContainer = function(){
    return container;
  }

  this.setSentimentData = function(result){
    let sentimentData = result;
  }

  this.getSentimentData = function(){
    return sentimentData;
  }

  this.getSearchHistory = function() {
    return searchHistory;
  }

  this.deleteSearchHistory = function() {
    searchHistory = {"data": []};
    notifyObservers();
  }

  this.isSearchHistoryEmpty = function() {
    if (searchHistory.data.length > 0)
      return false;
    else
      return true;
  }

  // API Calls
  this.sentimentAnalysis = function () {
    // const url = 'http://www.sentiment140.com/api/bulkClassifyJson' + searchInput //TO DO: Fix correct URL
    // return fetch(url, httpOptions)
    //   .then(processResponse)
    //   .catch(handleError)
  }

  this.popularKeywords = function () {
    const url = 'https://api.twitter.com/1.1/trends/place.json?id=1'

    console.log(httpOptions);
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
