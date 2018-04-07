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
