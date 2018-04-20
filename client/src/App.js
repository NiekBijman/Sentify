import React, { Component } from 'react';
import './styles/app.css';
import { Route } from 'react-router-dom';
import Welcome from './welcome';
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
      <MuiThemeProvider>
        <div className="App">
          <header className="App-header">
            {/* <h1 className="App-title">{this.state.title}</h1> */}
            {/* We rended diffrent component based on the path */}
            <Route exact path="/" component={Welcome}/>
            <Route path="/discover" component={Discover}/>
            <Route path="/my-searches" component={MySearches}/>
            {/* <Route path="/login" component={Login}/> */}
          </header>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import {red500} from 'material-ui/styles/colors';
//
// <MuiThemeProvider muiTheme={muiTheme}>
//
// const muiTheme = getMuiTheme({
//   palette: {
//     textColor: red500,
//   },
//   appBar: {
//     height: 50,
//   },
// });
