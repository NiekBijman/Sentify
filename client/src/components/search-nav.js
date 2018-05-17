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
    page: this.props.page,
    disabled: false,
  };

  componentDidMount = () => {
    modelInstance.addObserver(this);

    modelInstance.getSignInStatus().then( loggedIn => {
      if(loggedIn){
        this.setState({disabled: false})
      }
      else{
        this.setState({disabled: true})
      }
    });
  }

  update = details => {
    if (details ==='signInSuccess') {
      this.setState({disabled: false})
    }
    if (details ==='signInFailed') {
      this.setState({disabled: true})
    }
    if (details ==='signOutSucceeded') {
      this.setState({disabled: true})
    }
  }

  onMouseOver() {
      this.setState({isHovered: true});
  }

  onMouseOut() {
      this.setState({isHovered: false});
  }


  handleChange = (event) => {
    var buttonTitle = event.target.innerText;
    modelInstance.getSignInStatus().then( loggedIn => {
      if (buttonTitle === "SENTIMENT" && this.state.page !== 0)  {
        window.location.assign('/discover');
      }
      else if (buttonTitle === "MY SEARCHES" && this.state.page !== 1 && loggedIn){
        //trigger notification "please sign in to visit this page"
        window.location.assign('/my-searches');
      }
    });
  };

  handleClick = event => {
    if(this.state.disabled){
      modelInstance.setErrorMessages('LOGIN_REQUIRED')
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root} id="search-nav">
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.page}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            <Tab label="SENTIMENT" />
            <Tab label="MY SEARCHES" open={this.state.disabled} onClick={this.handleClick.bind(this)}/>
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
