import React from 'react';
import '../styles/search.css';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    align: 'center',

  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    width: "100%",
    font: 'Roboto medium',
  },
});

const SearchLocation = props => {
  const { classes } = props;

  return (
    <div className={classes.container}>
      <TextField
          className={classes.textField}
          placeholder="LOCATION"
          value={props.placeName.toUpperCase()}
          onChange={evt => props.handleLocation(evt)}
        />
    </div>
  );
};

export default withStyles(styles)(SearchLocation);
