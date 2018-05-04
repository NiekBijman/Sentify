import React, { Component } from 'react';
import Button from 'material-ui/Button';
var firebase = require("firebase");



export default class Login extends Component {
  constructor(props){
    super(props)
  }
  handleSignIn(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider)
  }

  greetingUser(){
      firebase.auth().getRedirectResult().then(function(result) {
          console.log(result)
      }).catch(function(error) {
        console.log(error);
      });

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
