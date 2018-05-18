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

    this.state = {
      searchSuggestion: 'Search for tweets here',
      anchorEl: null,
      page: 0,
      placeName: null, // === '' ? "LOCATION" : modelInstance.getPlaceName()
      placeOptions: modelInstance.getPlaceOptions(),
      searchInput: modelInstance.getSearch(),
      disabledDate: false
    };
    // Defining debounce is needed in constructor https://goo.gl/3D3vdf
    this.searchTweets = debounce(500, this.searchTweets);
  }

  componentDidMount() {
    modelInstance.addObserver(this);
    //this.searchTweets();
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onDayChange = date => {
    this.setState({
      anchorEl: null,
      disabledDate: false
    });
    modelInstance.setDate(date);
    this.searchTweets();
  };

  handleInput = event => {
    console.log("search.handleInput event.target.value");
    console.log(event.target.value);
    modelInstance.setSearch(event.target.value);
  }

  handleLocation = (result, lat, lng, text) => {
    console.log(result);
    modelInstance.setPlaceName(this.capitalize(result));

    //When the data arrives we want to set the Coordinates to update the Map
    modelInstance.setCoordinates(lng, lat);
    console.log(lng, lat);

    let location = lat + ',' + lng + ',100km';

    modelInstance.setGeocode(location);
  }

  // Turn uppercase into capitalized strings
  capitalize = str => {
   return str.toLowerCase().split(' ').map(function(word) {
     if (word[0] === undefined) return "";
     return word.replace(word[0], word[0].toUpperCase());
   }).join(' ');
  }

  searchTweets = () => {
    this.props.handleStatusChange('INITIAL');
    if(modelInstance.getSearch() !== ''){
      modelInstance.searchTweets().then(result => {
        //Check if the search found any tweets
        if(result.data.statuses.length === 0){
          modelInstance.setErrorMessages('NO_TWEETS');
          return
        }
        modelInstance.setTweets(result);
        this.setState({
          data: result
        });
        this.sentimentAnalysis();

      }).catch(() => {
        // this.props.handleStatusChange('ERROR');
        modelInstance.setErrorMessages('ERROR');
      });
    }
    else{
      this.props.handleStatusChange('NULL');
      modelInstance.setErrorMessages('NO_SEARCH');
    }
  }

  sentimentAnalysis = () => {
    modelInstance.analyzeSentiment().then(result => {
      this.props.handleStatusChange('LOADED');
      modelInstance.setSentimentData(result);
    }).catch( e => {
      console.log(e);
      // modelInstance.setErrorMessages('ERROR')
    });
  }

  handleClose = () => {
    this.setState({
      anchorEl:null,
    });
  }

  update(details){
    if(details ==='geoCodeSet' && modelInstance.getGeocode() !== ''){
      this.setState({
        disabledDate: false
      });
      this.searchTweets();
    };
    if(details ==='placeNameSet'){
      console.log("placeNameSet sets placename to");
      console.log(modelInstance.getPlaceName());
      this.setState({
        placeName: modelInstance.getPlaceName(), //.toUpperCase()
        disabledDate: false,
      });
    };
    if(details === 'placeNameSet-NoSearch'){
      this.setState({
        placeName: modelInstance.getPlaceName(),
      });
    }
    if(details ==='placeNameReset'){ // && modelInstance.getSearch() !== ''
        this.searchTweets();
        this.setState({
          placeName: "LOCATION", //.toUpperCase()
        })
    };
    if(details === 'searchInputSet'){
      this.searchTweets();
      this.setState({
        searchInput: modelInstance.getSearch(),
        disabledDate: false,
      });
    };
    if(details === 'searchInputSet-NoSearch'){
      this.setState({
        searchInput: modelInstance.getSearch(),
        disabledDate: true,
      });
    };
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
              <p>SINCE</p>
            </Col>
            <Col xs={3} sm={3} md={3} className='date'>
              <SearchDate handleClose={this.handleClose} anchorEl={this.state.anchorEl} click={this.handleClick} dayChange={this.onDayChange} disabled={this.state.disabledDate}/>
            </Col>
            <Col xs={2} sm={2} md={2} className='text'>
              <p>LOCATION</p>
            </Col>
            <Col xs={5} sm={5} md={5} className='location'>
              <SearchLocation placeName = {this.state.placeName} placeOptions = {this.state.placeOptions}  handleLocation={this.handleLocation.bind(this)}/>
            </Col>

          </Row>
        </div>
    )
  }
}

export default Search;
