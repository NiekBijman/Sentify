import React, { Component } from 'react';
import PieChart from 'react-simple-pie-chart';
import SentimentPie from '../components/sentiment-pie';
import SearchInput from '../components/search-input';
import SearchNav from '../components/search-nav';
import SearchDate from '../components/search-date';
import SearchLocation from '../components/search-location';
import { modelInstance } from '../model/model'
import '../styles/search.css';
import ButtonImportant from '../components/button-important'
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import { Row, Col } from 'react-flexbox-grid';
import Typist from 'react-typist';
import Hidden from 'material-ui/Hidden';


class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      data: null,
      searchSuggestion: 'Search for tweets here',
      anchorEl: null,
      date: 'Today',

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

    componentDidMount = () =>{

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


  render(){
    const { anchorEl } = this.state;


    return(
      <div className='container-discover'>
        <div className='search'>
          <Hidden only="xs">
            <Row id='searchInput'>
              {/* <h1>Sentiment</h1> */}
              {/* <input onChange={(input) => this.searchInput(input)}></input> */}
              <SearchInput searchInput = {this.state.searchInput} searchSuggestion = {this.state.searchSuggestion}/>
              {/* <Typist className='container-type'>
                #Lastweektonight
              </Typist> */}
            </Row>
          </Hidden>
          <Row>
            <SearchNav/>
          </Row>
          <Row id='date-location'>
            {/* <button onClick={this.buttonClicked}>Search</button> */}
            {/* <ButtonImportant onClick={this.buttonClick} className='btn btn-danger btn-xs'/> */}
            <Col sm={2} md={2}>
              From
            </Col>
            <Col sm={4} md={4}>
              <SearchDate date= {this.state.date} anchorEl={this.state.anchorEl} click={this.handleClick} dayChange={this.onDayChange}/>
            </Col>

            <Col sm={4} md={4}>
              <SearchLocation searchInput = {this.state.searchInput}/>
            </Col>

          </Row>
        </div>
      </div>


    )
  }
}

export default Search;
