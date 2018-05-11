import React from 'react';
import '../styles/search.css';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import MapboxAutocomplete from 'react-mapbox-autocomplete';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    align: 'center',


  },
  textField: {
    // width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '0',
    background: 'transparent',
    border: 'none',
    paddingBottom: 0,
    marginTop: 0,
    fontWeight: 500,
    width: "100%",
    'font-family': 'Roboto medium',
    'text-transform': 'uppercase',
  },
});

const SearchLocation = props => {
  const { classes } = props;
  console.log(props.placeName)

  return (
    <div className={classes.container}>
      {/* <TextField
          className={classes.textField}
          placeholder="LOCATION"
          value={props.placeName.toUpperCase()}
          onChange={evt => props.handleLocation(evt)}
        /> */}
      <MapboxAutocomplete
          publicKey='pk.eyJ1Ijoibmlla2Jpam1hbiIsImEiOiJjamY0MnN2NXkxaGpjMzRwZHloM3FoZG9uIn0.eZBRbD2LO-4yNS-gXVtRag'
          inputClass={classes.textField}
          onSuggestionSelect={props.handleLocation}
          // query =  {props.placeName}
          resetSearch={true}
          placeholder={props.placeholder}
          value={props.placeName}
        />
    </div>
  );
};

export default withStyles(styles)(SearchLocation);
