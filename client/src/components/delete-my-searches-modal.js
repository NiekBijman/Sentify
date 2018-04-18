import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: '50%',
    left: '50%',
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class DeleteMySearchesModal extends React.Component {
  state = {
    open: this.props.open,
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.props.open}
          onClose={this.props.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="title" id="modal-title">
              Confirm deleting selected searches
            </Typography>
            <Typography variant="subheading" id="simple-modal-description">
              Delete the selected searches ?
            </Typography>
            <Button onClick={this.props.handleConfirm}>Confirm</Button>
            <Button onClick={this.props.handleCancel}>Cancel</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

DeleteMySearchesModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeleteMySearchesModal);