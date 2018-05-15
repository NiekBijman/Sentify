import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import { Row, Col } from 'react-flexbox-grid';
import SentimentPDF from '../components/sentiment-pdf';

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

class CreatePDFModal extends React.Component {
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
          <div style={getModalStyle()} className={classes.paper} id="create-pdf-modal">
            <div id="divToPrint">
                <div className="tweets-info">
                    <div className='title'>{this.props.searchInput.toUpperCase()}</div>
                    <Row>
                        <Col xs={6} className="tweets-info-title">Amount of tweets:</Col>
                        <Col xs={6} className="tweets-info-value">{this.props.tweetAmount}</Col>
                    </Row>
                    <Row>
                        <Col xs={6} className="tweets-info-title">Geography:</Col>
                        <Col xs={6} className="tweets-info-value">{this.props.placeName}</Col>
                    </Row>
                    <Row>
                        <Col xs={6} className="tweets-info-title">Until:</Col>
                        <Col xs={6} className="tweets-info-value">{this.props.date}</Col>
                    </Row>
                    {this.props.pieChart}
                    <div className="pos">
                      <i className="material-icons negative">
                        fiber_manual_record
                      </i>
                      negative tweets
                    </div>
                    <div className="neg">
                      <i className="material-icons positive">
                        fiber_manual_record
                      </i>
                      positive tweets
                    </div>
                </div>
            </div>
            <Button onClick={this.props.handleSavePDF} color="secondary">
                <SentimentPDF/>
                Save
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

CreatePDFModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreatePDFModal);
