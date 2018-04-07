import React, { Component } from 'react';
import './styles/app.css';
import { Route } from 'react-router-dom';
import Welcome from './welcome';
import Discover from './discover';
import { modelInstance } from './model/model'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{this.state.title}</h1>

          {/* We rended diffrent component based on the path */}
          <Route exact path="/" component={Welcome}/>
          <Route path="/search" component={Discover}/>


        </header>
      </div>
    );
  }
}

export default App;
