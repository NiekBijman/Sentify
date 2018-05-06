import React, { Component } from 'react';
import Button from 'material-ui/Button';
<<<<<<< HEAD
import { modelInstance } from './model/model';
=======
import {modelInstance} from './model/model'
>>>>>>> ae55bf6ba249b02b1c8eb5f189e923f42da72e25

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
<<<<<<< HEAD

  handleSignIn(){
    modelInstance.googleSignIn();
  }

  handleSignOut(){
    modelInstance.signOut();
  }
=======
>>>>>>> ae55bf6ba249b02b1c8eb5f189e923f42da72e25

  update(details){
    if (details === "userName") {
      this.setState({
        userName: modelInstance.getUserName(),
      });
    }
  }
  
  render() {
    return(
<<<<<<< HEAD
      <div className = "loginHeader">
        <Button onClick = {this.handleSignIn} >Sign in with google</Button>
        <Button onClick = {this.handleSignOut} >Sign Out</Button>
        <Button>{this.state.userName}</Button>
=======
      <div>
        <Button onClick = {modelInstance.signIn} >Sign in with google</Button>
        <Button onClick = {modelInstance.greetUser} >Hello to you</Button>
>>>>>>> ae55bf6ba249b02b1c8eb5f189e923f42da72e25
      </div>
    )
  }
}
