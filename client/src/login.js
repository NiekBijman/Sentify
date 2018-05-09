import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { modelInstance } from './model/model';
import ButtonImportant from './components/button-important';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.update = this.update.bind(this);
    this.state = {
      userName: 'Sign in'
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
      <React.Fragment>
        <ButtonImportant className='intro-button' size="small" text='Explain App' toggleSteps={this.props.toggleSteps}/>
        <Button size="small" onClick = {this.handleSignIn} >{this.state.userName}</Button>
        <Button size="small" onClick = {this.handleSignOut} >Sign Out</Button>
      </React.Fragment>
    )
  }
}
