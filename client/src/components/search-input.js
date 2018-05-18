import React from 'react';
import '../styles/search.css';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';

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
    fontFamily : 'Roboto Thin',
    fontSize: '2rem',
    align: 'right'
  }
});

const SearchInput = props => {
  const { classes } = props;
  return (
      <TextField
          className={classes.textField}
          fontSize='30px'
          margin="normal"
          value={props.searchInput}
          placeholder="search for tweets"
          // helperText="Tweets, Keywords, "
          InputProps={{className: classes.input}}
          onChange={((props.page === 1)
                      ? evt => props.handleInput(evt)
                      : console.log("Searching")
                    )}
      />

  );
};

export default withStyles(styles)(SearchInput);
