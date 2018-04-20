import React, { Component } from 'react';
import SearchInput from '../components/search-input';
import SearchNav from '../components/search-nav';
import SearchDate from '../components/search-date';
import SearchLocation from '../components/search-location';
import { modelInstance } from '../model/model';
import '../styles/search.css';
import { Row, Col } from 'react-flexbox-grid';
import Hidden from 'material-ui/Hidden';

class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      data: null,
      searchSuggestion: 'Search for tweets here',
      anchorEl: null,
      date: 'Today',
      page: 0,
    }
  }

  buttonClicked = () =>{
    // TO DO: API Call should be made here
    modelInstance.searchTweets().then(result => {
      console.log(result);
      modelInstance.setSentimentData(result);
      this.setState({
        status: 'LOADED',
        data: result
      })

    }).catch(() => {
      this.setState({
        status: 'ERROR'
        })
      })
  }

  searchInput(input){
    console.log(input.target.value);
    modelInstance.setSearch(input.target.value);
    this.setState({
      // searchInput:input.target.value
    })
  }

  buttonClick(){
    console.log('clicked');
    // TO DO: API Call should be made here
  //   modelInstance.sentimentAnalysis(this.state.searchInput).then(result => {
  //     modelInstance.setSentimentData(result);
  //     this.setState({
  //       status: 'LOADED',
  //       data: result
  //     })
  //
  //   }).catch(() => {
  //     this.setState({
  //       status: 'ERROR'
  //       })
  //     })
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onDayChange = date => {
    this.setState({date: date})
    this.setState({ anchorEl: null });
  };

  handleInput = function(evt) {
    modelInstance.setSearch(evt.target.value);
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
    const { anchorEl } = this.state;

    return(
      <div className='container-discover'>
        <div className='search'>
          <Hidden only="xs">
            <Row id='searchInput'>
              {/* <h1>Sentiment</h1> */}
              {/* <input onChange={(input) => this.searchInput(input)}></input> */}
              <SearchInput handleInput={this.handleInput} searchInput = {this.state.searchInput} searchSuggestion = {this.state.searchSuggestion} page={1}/>
              {/* <Typist className='container-type'>
                #Lastweektonight
              </Typist> */}
            </Row>
          </Hidden>
          <Row>
            <SearchNav page={this.state.page}/>
          </Row>
          <Row id='date-location'>
            {/* <button onClick={this.buttonClicked}>Search</button> */}
            {/* <ButtonImportant onClick={this.buttonClick} className='btn btn-danger btn-xs'/> */}
            <Col xs={2} sm={2} md={2}>
              From
            </Col>
            <Col xs={4} sm={4} md={4}>
              <SearchDate date= {this.state.date} anchorEl={this.state.anchorEl} click={this.handleClick} dayChange={this.onDayChange}/>
            </Col>
            <Col xs={4} sm={4} md={4}>
              <SearchLocation searchInput = {this.state.searchInput}/>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default Search;
