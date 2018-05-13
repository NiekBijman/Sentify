import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { modelInstance } from './model/model';
import ButtonImportant from './components/button-important';
import Menu, { MenuItem } from 'material-ui/Menu';
import { Link } from 'react-router-dom';


export default class Login extends Component {
  constructor(props){
    super(props);
    this.update = this.update.bind(this);
    this.state = {
      userName: 'Sign in',
      anchorEl: null,
      logged_in: false
    }
  }

  componentDidMount() {
    modelInstance.addObserver(this);
  }

  handleClick = event => {
    if (this.state.logged_in){
      this.setState({ anchorEl: event.currentTarget });
    }
    else{
      this.handleSignIn();
    }
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSignIn(){
      modelInstance.googleSignIn();
  }

  handleSignOut(){
    modelInstance.signOut();
    this.setState({logged_in: false, userName: 'Sign in'})
    this.handleClose()
  }

  update(details){
    if (details === "signInSuccess") {
      this.setState({
        userName: modelInstance.getUserName(),
        logged_in: true
      });
    }
  }

  render() {
    const { anchorEl } = this.state;
    return(
      <React.Fragment>
        <ButtonImportant className='intro-button' size="small" text='Explain App' toggleSteps={this.props.toggleSteps}/>
        <Button
          variant="raised"
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          // size="small"
          // onClick = {this.handleSignIn}
        >
          {this.state.userName}
        </Button>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <Link to="/my-searches">
              <MenuItem onClick={this.handleClose}>my Searches</MenuItem>
          </Link>
          <MenuItem onClick={this.handleSignOut.bind(this)}>Logout</MenuItem>
        </Menu>

        {/* <Button size="small" onClick = {this.handleSignOut} >Sign Out</Button> */}
      </React.Fragment>
    )
  }
}
