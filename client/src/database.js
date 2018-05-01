import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { modelInstance } from './model/model';
import { firebaseConfig } from './config';

//this firebase instance is used frequently. Where should we store it?
var firebase = require("firebase");
//firebase initialization
firebase.initializeApp(firebaseConfig);
//database instiation
var database = firebase.database();



export default class Database extends Component{
  constructor(props){
    super(props);
  }

  setFirebaseData(){
    var searchHistoryData = {"id":1, "subject":"#LastWeekTonight", "Location": "America", "dateStart": "20-02-18", "dateFinish": "26-02-18", "dateCreated": "27-02-18", "downloadPDF": false};
    //setup of path to reference the data
    var searchObjRef = database.ref('searches/' + searchHistoryData.id);
    //inserting data
    searchObjRef.set(searchHistoryData);
  }

  deleteFirebaseData(){
    var searchObjRef = database.ref('searches/' + "1");
    searchObjRef.remove();
  }

  logFirebaseData(){
    //referencing the same path as previously inserted data
    var searchObjRef = database.ref('searches/' + "1");
    searchObjRef.once('value', function(snapshot) {
    //value retreived from firebase
    console.log(snapshot.val());
    });
  }

  render() {
    return(
      <div>
          {/* enters search history object to firebase */}
          <Button onClick = {this.setFirebaseData} >Insert data into firebase</Button>
        <Button onClick = {this.deleteFirebaseData} >Delete data</Button>
          <Button onClick = {this.logFirebaseData} >Log dat firebase data </Button>
      </div>
    )
  }

}
