import React, { Component } from 'react';
import PieChart from 'react-simple-pie-chart';
import SentimentPie from '../components/sentiment-pie';
import SearchInput from '../components/search-input';
import { modelInstance } from '../model/model'
import '../styles/search.css';
import ButtonImportant from '../components/button-important'
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';

class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      data: null,
      searchInput: 'Search Input Value',
      anchorEl: null,
      date: 'Today'
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
    // const days = [
    //     {date: 'Today'},
    //     {date: 'Yesterday'},
    //     {date: '2 days ago'},
    //     {date: '3 days ago'},
    //     {date: '4 days ago'},
    //     {date: '5 days ago'},
    //     {date: '6 days ago '},
    //     {date: '7 days ago'},
    //     ];
    //
    // let daysList = null;
    // {daysList = days.map((date, index) => (
    //   console.log(days, index),
    //   <MenuItem
    //       key={index}
    //       onClick={this.onDayChange(date.date)}
    //   >{date.date}</MenuItem>)
    // )}

    return(
      <div className='search'>
        <div className='row'>
          <h1>Sentiment</h1>
          <input onChange={(input) => this.searchInput(input)}></input>
          {/* <SearchInput searchInput = {this.state.searchInput}/> */}
        </div>
        <div className='row'>
          <button onClick={this.buttonClicked}>Search</button>
          {/* <ButtonImportant onClick={this.buttonClick} className='btn btn-danger btn-xs'/> */}
          {/* <div>
            <Button
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              {this.state.date}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.onDayChange}
            >
              {/* {daysList}

              <MenuItem onClick={this.onDayChange}>Yesterday</MenuItem>
              <MenuItem onClick={this.onDayChange}>2 Days past</MenuItem>
              <MenuItem onClick={this.onDayChange}>3 Days past</MenuItem>
              <MenuItem onClick={this.onDayChange}>4 Days past</MenuItem>
              <MenuItem onClick={this.onDayChange}>5 Days past</MenuItem>
              <MenuItem onClick={this.onDayChange}>6 Days past</MenuItem>
              <MenuItem onClick={this.onDayChange}>7 Days past</MenuItem>
            </Menu>
          </div>*/}

        </div>
        </div>


    )
  }
}

export default Search;
