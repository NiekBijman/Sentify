import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

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
  },
});

function ButtonDiscover(props) {
  const { classes } = props;
  return (
    <Button variant="raised" className={classes.button}>
      Discover
    </Button>
  );
}

ButtonDiscover.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonDiscover);
