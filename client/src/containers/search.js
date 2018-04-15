import React, { Component } from 'react';
import PieChart from 'react-simple-pie-chart';
import SentimentPie from '../components/sentiment-pie';
import SearchInput from '../components/search-input';
import { modelInstance } from '../model/model'
import '../styles/search.css';

class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      searchInput: 'Search Input Value'
      }
    }
  searchInput(input){
    console.log(input);
    this.setState({
      searchInput:input.target.value
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

  render(){
    return(
      <div className='search'>
        <div className='row'>
          <h1>Sentiment</h1>
          <input onChange={(input) => this.searchInput(input)}></input>
        </div>
        <div className='row'>
          <SearchInput searchInput = {this.state.searchInput}/>
          <button onClick={this.buttonClick} className='btn btn-danger btn-xs'>SEARCH</button>
        </div>
      </div>
    )
  }
}

export default Search;
