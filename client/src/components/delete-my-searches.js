import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit * 2,
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
  },
});

function DeleteMySearches(props) {
  return (
    <div id="delete-my-searches">
      <Tooltip id="tooltip-icon" title="Delete My Searches">
        <IconButton aria-label="Delete" onClick={props.handleClick} disabled={props.disabled}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

DeleteMySearches.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeleteMySearches);