import React, { Component } from 'react';
import './styles/app.css';
import { Route } from 'react-router-dom';
import Welcome from './welcome';
import Discover from './discover';
import MySearches from './my-searches';
import Login from './login';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import Database from './database';

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
            <Route path="/login" component={Login}/>
            <Route exact path="/" component={Discover}/>
            <Route path="/discover/:query?/:pos?/:neg?/:noOfNeu?/:tot?/:until?" component={Discover}/>
            <Route path="/my-searches" component={MySearches}/>
            {/* <Route path="/database" component={Database}/> */}
          </header>
        </div>
    );
  }
}

export default App;
