const httpOptions = {
  headers: {'X-Mashape-Key': 'YOUR_API_KEY'}
};

const Model = function () {
  let container = 'Map';
  let observers = [];
  let searchInput = '';
  let sentimentData = {"data": [{"text": "I love Titanic.", "id":1234, "polarity": 4},
                      {"text": "I love Titanic.", "id":1234, "polarity": 4},
                      {"text": "I don't mind Titanic.", "id":1234, "polarity": 2},
                      {"text": "I dislike Titanic.", "id":1234, "polarity": 4},
                      {"text": "I hate Titanic.", "id":4567, "polarity": 0}]};



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

  // API Calls
  this.sentimentAnalysis = function () {
    // const url = 'http://www.sentiment140.com/api/bulkClassifyJson' + searchInput //TO DO: Fix correct URL
    // return fetch(url, httpOptions)
    //   .then(processResponse)
    //   .catch(handleError)
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
