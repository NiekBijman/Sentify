import React, { Component } from 'react';
import Button from 'material-ui/Button';
import {firebaseConfig} from "./config";
var firebase = require("firebase");
firebase.initializeApp(firebaseConfig);



export default class Login extends Component {
  constructor(props){
    super(props)
  }
  handleSignIn(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  greetingUser(){
    var user = firebase.auth().currentUser;
    alert("Hello " + user.displayName);
  }

  render() {
    return(
      <div>
        <Button onClick = {this.handleSignIn} >Sign in with google</Button>
        <Button onClick = {this.greetingUser} >Hello to you</Button>
      </div>
    )
  }
}
