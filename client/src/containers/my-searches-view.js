import React, { Component } from 'react';  
import '../styles/my-searches.css';
import MySearchesTable from '../components/my-searches-table';
import SearchNav from '../components/search-nav';
import DeleteMySearches from '../components/delete-my-searches';
import DeleteMySearchesModal from '../components/delete-my-searches-modal';

class MySearchesView extends Component {
  constructor(props){
    super(props)
    this.state = {
      searchHistory: this.props.model.getSearchHistory(),
      page: 2,
      open: false,
      disabledDeleteBtn: this.props.model.isSearchHistoryEmpty()
    }
  }

  componentDidMount() {
    this.props.model.addObserver(this);
  }

  componentWillUnmount() {
    this.props.model.removeObserver(this);
  }

  update() {
    this.setState({
      searchHistory: this.props.model.getSearchHistory(),
      disabledDeleteBtn: this.props.model.isSearchHistoryEmpty()
    })
  }

  handleClickDeleteBtn = (event) => {
    this.setState({
      open: true
    })
  };

  handleCloseModal = () => {
    this.setState({ 
      open: false 
    });
  };

  handleConfirm = () => {
    this.props.model.deleteSearchHistory();
    console.log("Deletion completed");
    this.handleCloseModal();
  }

  handleCancel = () => {
    console.log("Deletion canceled.");
    this.handleCloseModal();
  }

  render(){
    return(
      <div className="container">
        <h1>my Searches</h1>
        <SearchNav page={this.state.page}/>
        <MySearchesTable data={this.state.searchHistory.data}/>
        <DeleteMySearches handleClick={this.handleClickDeleteBtn} disabled={this.state.disabledDeleteBtn}/>
        <DeleteMySearchesModal 
          open={this.state.open} 
          handleClose={this.handleCloseModal} 
          handleConfirm={this.handleConfirm}
          handleCancel={this.handleCancel}
        />
      </div>
    )
  }
}
export default MySearchesView;