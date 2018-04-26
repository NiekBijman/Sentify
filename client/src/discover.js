import React from 'react';
import './styles/discover.css';
import Map from './containers/map';
import Search from './containers/search';
import SentimentContainer from './containers/sentiment';

class Discover extends React.Component {
  render () {
    return (
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
            <SentimentContainer/>
          </div>
        </div>
    );
  }
}

export default Discover;
