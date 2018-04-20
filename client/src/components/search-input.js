import React from 'react';
import '../styles/search.css';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Typist from 'react-typist';


//This is the Presentation component
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%"
  },
  input:{
    fontSize: '3rem',
    align: 'right'
  }
});


const SearchInput = props => { //({onChange = this.handleChange})
  const { classes } = props;

  return (
      <TextField
          className={classes.textField}
          fontSize='30px'
          margin="normal"
          placeholder="Search for tweets"
          helperText="Data about trending topics around the world"
          InputProps={{className: classes.input}}
      />

  );
};

export default withStyles(styles)(SearchInput);
