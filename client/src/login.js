import React, { Component } from 'react';
import Button from 'material-ui/Button';
import {modelInstance} from './model/model'

export default class Login extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return(
      <div>
        <Button onClick = {modelInstance.signIn} >Sign in with google</Button>
        <Button onClick = {modelInstance.greetUser} >Hello to you</Button>
      </div>
    )
  }
}
