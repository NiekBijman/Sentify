import React, { Component } from 'react';
import './Main.css';
import { Link } from 'react-router-dom';
import Map from '../Map/Map';
import {modelInstance} from '../data/Model';

class Main extends Component {
  constructor(props) {
    super(props);
    // We create the state to store the various statuses
    // e.g. API data loading or error
    this.state = {
      container: 'Map',
      status: 'INITIAL'
    }

    modelInstance.setContainer(this.state.container);
  }



  // componentDidMount = () => {
  //   // when data is retrieved we update the state
  //   // this will cause the component to re-render
  //   modelInstance.getMap().then(data => {
  //     this.setState({
  //       status: 'LOADED',
  //       country: data
  //     })
  //   }).catch(() => {
  //     this.setState({
  //       status: 'ERROR'
  //     })
  //   })
  // }



  render() {

    return (
      <div className="row">
        <div className="col-xs-10">
        </div>
        <div className="col-xs-2">
          <Map/>
        </div>
      </div>
    );
  }
}

export default Main;
