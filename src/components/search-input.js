import React, { Component } from 'react';
import PieChart from 'react-simple-pie-chart';
import '../styles/search.css';
import Search from '../containers/search';

import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';

//This is the Presentation component
const styles = theme => ({
  container: {
    // display: 'flex',
    flexWrap: 'wrap',
    textalign: 'right'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
});

const SearchInput = props => { //({onChange = this.handleChange})
  const { classes } = props;

  return (
    <div className={classes.container}>
      <TextField
        // label="None"
        id="margin-none"
        defaultValue="Search"
        className={classes.textField}
        helperText="Search for hashtags and keywords"
        textalign='right'
      />
    </div>
  );
};

export default withStyles(styles)(SearchInput);
