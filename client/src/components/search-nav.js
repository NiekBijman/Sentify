import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import { modelInstance } from '../model/model';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    flexGrow: 1,
    width: '44vw',
  },
});

class SearchNav extends React.Component {
  state = {
    value: this.props.page,
  };

  handleChange = (event) => {
    var buttonTitle = event.target.innerText;
    modelInstance.getSignInStatus().then((loggedIn)=>{
      if (buttonTitle === "SENTIMENT" && this.state.value !== 0)
        window.location.assign('/discover');
      else if (buttonTitle === "MY SEARCHES" && this.state.value !== 2 && loggedIn){
        //trigger notification "please sign in to visit this page"
        window.location.assign('/my-searches');
      }
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root} id="search-nav">
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
