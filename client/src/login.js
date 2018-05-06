import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { modelInstance } from './model/model';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.update = this.update.bind(this);
    this.state = {
      userName: modelInstance.getUserName()
    }
  }

  componentDidMount() {
    modelInstance.addObserver(this);
  }

  handleSignIn(){
    modelInstance.googleSignIn();
  }

  handleSignOut(){
    modelInstance.signOut();
  }

  update(details){
    if (details === "userName") {
      this.setState({
        userName: modelInstance.getUserName(),
      });
    }
  }
  
  render() {
    return(
      <div className = "loginHeader">
        <Button onClick = {this.handleSignIn} >Sign in with google</Button>
        <Button onClick = {this.handleSignOut} >Sign Out</Button>
        <Button>{this.state.userName}</Button>
      </div>
    )
  }
}
