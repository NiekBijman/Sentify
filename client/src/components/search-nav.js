import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    padding: '0',
    transform: 'scale(0.7)',
    width: '50vw',
    marginLeft: '-36%'
  },
});

class SearchNav extends React.Component {
  state = {
    value: this.props.page,
  };

  handleChange = (event) => {
    if (event.target.innerText === "SENTIMENT" && this.state.value !== 0)
      window.location.assign('/discover');
    else if (event.target.innerText === "LIVE TWEETS" && this.state.value !== 1)
      window.location.assign('/live-tweets');
    else if (event.target.innerText === "MY SEARCHES" && this.state.value !== 2)
      window.location.assign('/my-searches');
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            <Tab label="SENTIMENT" />
            <Tab label="LIVE TWEETS" />
            <Tab label="MY SEARCHES" />
          </Tabs>
        </AppBar>
      </div>
    );
  }
}

SearchNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchNav);
