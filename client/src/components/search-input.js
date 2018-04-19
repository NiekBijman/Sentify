import React from 'react';
import '../styles/search.css';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';

//This is the Presentation component
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%",
  },
});

const SearchInput = props => { //({onChange = this.handleChange})
  const { classes } = props;

  return (
    <div className={classes.container}>
      <TextField
          id="search"
          label="Search"
          type="search"
          className={classes.textField}
          margin="normal"
        />
    </div>
  );
};

export default withStyles(styles)(SearchInput);
