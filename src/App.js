import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Welcome from './Welcome/Welcome';
import Main from './Main/Main';
import { modelInstance } from './data/Model'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: 'Sentify',
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{this.state.title}</h1>

          {/* We rended diffrent component based on the path */}
          <Route exact path="/" component={Welcome}/>
          <Route path="/search" component={Main}/>


        </header>
      </div>
    );
  }
}

export default App;
