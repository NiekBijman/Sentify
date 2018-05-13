import React from 'react';
import '../styles/search.css';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import MapboxAutocomplete from 'react-mapbox-autocomplete';

const styles = theme => ({
  container: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // align: 'center',
    // 'margin-top': '10',

  },
  textField: {
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

  return (
    <div className={classes.container}>
      <MapboxAutocomplete
          publicKey='pk.eyJ1Ijoibmlla2Jpam1hbiIsImEiOiJjamY0MnN2NXkxaGpjMzRwZHloM3FoZG9uIn0.eZBRbD2LO-4yNS-gXVtRag'
          inputClass={classes.textField}
          onSuggestionSelect={props.handleLocation}
          resetSearch={true}
          placeholder={props.placeName}
        />
    </div>
  );
};

export default withStyles(styles)(SearchLocation);
