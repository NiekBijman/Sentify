import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import HistoryIcon from '@material-ui/icons/History';
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

function HistoryMySearches(props) {
  return (
    <div id="history-my-searches">
      <Tooltip id="tooltip-icon" title="History">
        <IconButton aria-label="History">
          <HistoryIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

HistoryMySearches.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HistoryMySearches);