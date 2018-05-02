import React, { Component } from 'react';
import SearchInput from '../components/search-input';
import SearchNav from '../components/search-nav';
import SearchDate from '../components/search-date';
import SearchLocation from '../components/search-location';
import { modelInstance } from '../model/model';
import {debounce} from 'throttle-debounce';
import '../styles/search.css';
import { Row, Col } from 'react-flexbox-grid';


class Search extends Component {
  constructor(props){
    super(props);
    var today = new Date();
    this.state = {
      searchSuggestion: 'Search for tweets here',
      anchorEl: null,
      page: 0,
      placeName: modelInstance.getPlaceName() === '' ? "LOCATION" : modelInstance.getPlaceName(),
      searchInput: modelInstance.getSearch()
    }
    // Defining debounce is needed in constructor https://goo.gl/3D3vdf
    this.searchTweets = debounce(500, this.searchTweets);
    this.searchGeocode = debounce(500, this.searchGeocode);
  }

  componentDidMount() {
    modelInstance.addObserver(this);
    this.searchTweets();
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onDayChange = date => {
    this.setState({ anchorEl: null });
    modelInstance.setDate(date);
    this.searchTweets();
  };

  handleInput = event => {
    this.setState({searchInput: event.target.value});
    modelInstance.setSearch(event.target.value);
    this.searchTweets();
  }

  handleLocation = event => {
    modelInstance.setPlaceName(this.capitalize(event.target.value));
    this.searchGeocode();
  }

  // Turn uppercase into capitalized strings
  capitalize = str => {
   return str.toLowerCase().split(' ').map(function(word) {
     if (word[0] === undefined) return "";
     return word.replace(word[0], word[0].toUpperCase());
   }).join(' ');
  }

  searchGeocode = () => {
    //Searching for the Coordinates of the Place the user searched for
    modelInstance.geocode().then(result => {
      console.log(result);
      //When the data arrives we wwant to set the Coordinates to update the Map
      modelInstance.setCoordinates(result[0], result[1]);

      //We also want to use the data as an input for the geocode in the Search Tweets API Call
      //IMPORTANT: Lat & Long are switched in the 'GET search/tweets' call
      let location = result[1].toFixed(6) + ',' + result[0].toFixed(6) + ',100km';
      modelInstance.setGeocode(location);
      this.searchTweets();
    }).catch(() => {
      this.props.handleStatusChange('ERROR');
    });
  }

  searchTweets = () => {
    if( modelInstance.getSearch() === "" ) {
      this.setState({data: null});
      modelInstance.setTweets(null);
      this.props.handleStatusChange("INITIAL");
      return;
    }
    this.props.handleStatusChange('INITIAL');
    modelInstance.searchTweets().then(result => {
      modelInstance.setTweets(result);
      this.props.handleStatusChange('LOADED');
      this.setState({
        data: result
      });
    }).catch(() => {
      this.props.handleStatusChange('ERROR');
    });
  }

  handleClose = () => {
    this.setState({
      anchorEl:null,
    });
  }

  update(details){
    if(details ==='geoCodeSet' && modelInstance.getGeocode() !== ''){
      this.searchTweets();
    }
    if(details ==='placeNameSet'){
      this.setState({
        placeName: modelInstance.getPlaceName() //.toUpperCase()
      })
    }
  }

  render(){
    return(
        <div className='search'>
          <Row id='searchInput'>
            <SearchInput handleInput={this.handleInput.bind(this)} searchInput={this.state.searchInput} searchSuggestion={this.state.searchSuggestion} page={1}/>
          </Row>
          <SearchNav page={this.state.page}/>
          <Row id='date-location'>
            <Col xs={2} sm={2} md={2} className='text'>
              <p>FROM</p>
            </Col>
            <Col xs={4} sm={4} md={4} className='date'>
              <SearchDate handleClose={this.handleClose} anchorEl={this.state.anchorEl} click={this.handleClick} dayChange={this.onDayChange}/>
            </Col>
            <Col xs={2} sm={2} md={2} className='text'>
              <p>IN</p>
            </Col>
            <Col xs={4} sm={4} md={4} className='location'>
              <SearchLocation placeName = {this.state.placeName} handleLocation={this.handleLocation.bind(this)}/>
            </Col>

          </Row>
        </div>
    )
  }
}

export default Search;
