import React, { Component } from 'react';
import '../styles/my-searches.css';
import MySearchesTable from '../components/my-searches-table';
import SearchNav from '../components/search-nav';

class MySearches extends Component {
  constructor(props){
    super(props)
    this.state = {
      page: 1,
    }
  }

  render(){
    return(
      <div className="container-my-searches">
        <SearchNav page={this.state.page}/>
        <MySearchesTable/>
      </div>
    )
  }
}
export default MySearches;
