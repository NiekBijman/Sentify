import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
    position: 'relative'
  },
});

function CircularIndeterminate(props) {
  const { classes } = props;
  return (
    <div className="progress">
      <CircularProgress value='indeterminate' className={classes.progress} size={100} thickness={4}/>
    </div>
  );
}

CircularIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CircularIndeterminate);
