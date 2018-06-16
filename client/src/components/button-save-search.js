import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import red from 'material-ui/colors/red';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    margin: theme.spacing.unit,
    border: '1px solid #4caf50',
    backgroundColor: 'transparent',
    color: '#4caf50',
    '&:hover': {
      backgroundColor: '#4caf50',
      color: '#fff',
    },
  },
  cssRoot: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  }
});

const SaveButton = props =>  {
  const { classes } = props;
  return (
    <Button
      variant="raised"
      disabled={props.disabled}
      className={classes.button}
      onClick = {props.handleClick}
      >
      {props.text}
    </Button>
  );
}

SaveButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SaveButton);
