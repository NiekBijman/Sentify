import React, { Component } from 'react';
import PieChart from 'react-simple-pie-chart';
import '../styles/search.css';
import Search from '../containers/search';

//This is the Presentation component
const SearchInput = ({searchInput}) =>
  <React.Fragment>
    <div>{searchInput}</div>
  </React.Fragment>

export default SearchInput;
