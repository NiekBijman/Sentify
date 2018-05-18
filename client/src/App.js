import React, { Component } from 'react';
import './styles/app.css';
import { Route } from 'react-router-dom';
import Discover from './discover';
import MySearches from './my-searches';
import Login from './login';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
            <Route path="/discover" component={Discover}/>
            <Route path="/my-searches" component={MySearches}/>
          </header>
        </div>
    );
  }
}

export default App;
