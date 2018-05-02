import React, { Component } from 'react';
import './styles/app.css';
import { Route } from 'react-router-dom';
import Welcome from './welcome';
import Discover from './discover';
import MySearches from './my-searches';
import Login from './login';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Database from './database';

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
            {/* <h1 className="App-title">{this.state.title}</h1> */}
            {/* We rended diffrent component based on the path */}
            <Route exact path="/" component={Welcome}/>
            <Route path="/discover" component={Discover}/>
            <Route path="/my-searches" component={MySearches}/>
            <Route path="/login" component={Login}/>
            <Route path="/database" component={Database}/>
          </header>
        </div>
    );
  }
}

export default App;