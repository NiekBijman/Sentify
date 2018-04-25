import React from 'react';
import '../styles/search.css';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    align: 'center'
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    width: "100%",
  },
});

const SearchLocation = props => {
  const { classes } = props;

  return (
    <div className={classes.container}>
      <TextField
          placeholder= {props.placeName}
          className={classes.textField}
        />
    </div>
  );
};

export default withStyles(styles)(SearchLocation);
