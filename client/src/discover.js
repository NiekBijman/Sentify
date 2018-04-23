import React from 'react';
import './styles/discover.css';
import Map from './containers/map';
import Search from './containers/search';
import SentimentView from './containers/sentiment-view';

class Discover extends React.Component {
  render () {
    return (
      <React.Fragment>
        <div className="container-discover">
          <div className="container-discover-top">
            <div className='map'>
              <Map/>
            </div>
            <div className='container-search'>
              <Search/>
            </div>
          </div>
          <div className="container-discover-bottom">
            <SentimentView/>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Discover;
