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
    super(props)
    this.state = {
      data: null,
      searchSuggestion: 'Search for tweets here',
      anchorEl: null,
      date: 'Today',
      page: 0,
      placeName: 'THE WORLD'
    }
    // Defining debounce is needed in constructor https://goo.gl/3D3vdf
    this.searchTweets = debounce(300, this.searchTweets);
  }

  componentDidMount() {
    modelInstance.addObserver(this);
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onDayChange = date => {
    this.setState({date: date})
    this.setState({ anchorEl: null });
  };

  handleInput = event => {
    modelInstance.setSearch(event.target.value);
    this.searchTweets();
  }

  update(details){
    if(details ==='geoCodeSet' && modelInstance.getGeocode() !== ''){
      this.searchTweets();
    }
    if(details ==='placeNameSet'){
      this.setState({
        placeName: modelInstance.getPlaceName().toUpperCase()
      })
    }
  }

  searchTweets = () => {
    modelInstance.searchTweets().then(result => {
      console.log(result);
      modelInstance.setSentimentData(result);
      this.setState({
        status: 'LOADED',
        data: result
      });
    }).catch(() => {
      this.setState({
        status: 'ERROR'
      });
    });
  }

  render(){
    return(
      <div className='search'>
        <Row id='searchInput'>
          <SearchInput handleInput={this.handleInput.bind(this)} searchInput={this.state.searchInput} searchSuggestion={this.state.searchSuggestion} page={1}/>
        </Row>
        <Row>
          <SearchNav page={this.state.page}/>
        </Row>
        <Row id='date-location'>
          <Col xs={2} sm={2} md={2}>
            <p>From</p>
          </Col>
          <Col xs={4} sm={4} md={4}>
            <SearchDate date= {this.state.date} anchorEl={this.state.anchorEl} click={this.handleClick} dayChange={this.onDayChange}/>
          </Col>
          <Col xs={4} sm={4} md={4}>
            <SearchLocation placeName = {this.state.placeName}/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Search;
