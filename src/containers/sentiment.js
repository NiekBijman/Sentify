import React, { Component } from 'react';
import PieChart from 'react-simple-pie-chart';
import SentimentPie from '../components/sentiment-pie';
import '../styles/sentiment-pie.css';

class Sentiment extends Component {
  constructor(props){
    super(props)
    this.state = {
      status: 'INITIAL',
      data: '',
      positive: null,
      negative: null,
      neutral: null,
      callBack: {"data": [{"text": "I love Titanic.", "id":1234, "polarity": 4},
                {"text": "I love Titanic.", "id":1234, "polarity": 4},
                {"text": "I don't mind Titanic.", "id":1234, "polarity": 2},
                {"text": "I don't mind Titanic.", "id":1234, "polarity": 2},
                {"text": "I hate Titanic.", "id":4567, "polarity": 0}]}
    }
  }

  dataCount = () => {
      var positive = 0;
      var negative = 0;
      var neutral = 0;

        var count = this.state.callBack.data.map((data) => {
              if(data.polarity === 4){
                positive = positive + 1;
                return positive;
              }
              if(data.polarity === 0){
                negative = negative + 1;
                return negative;
              }
              if(data.polarity === 2){
                neutral = neutral + 1;
                return neutral;
              }
            }
          )
      this.percentage( positive, negative, neutral);
    }

  percentage(negative, positive, neutral){
    var total = positive + negative + neutral;

    this.setState({
      positive: (positive / total) * 100,
      negative: (negative / total) * 100,
      neutral: (neutral / total) * 100
    })
  }

  componentDidMount = () => {
    this.dataCount();

    // // API Call should be made here, for now it's hardcoded
    // model.sentimentAnalysis().then(callBack => {
    //   this.setState({
    //     status: 'LOADED',
    //     // callBack:
    //   })
    //
    // }).catch(() => {
    //   this.setState({
    //     status: 'ERROR'
    //     })
    //   })
  }

  render(){
    return(
        <SentimentPie positive = {this.state.positive}
                      negative = {this.state.negative}
                      neutral = {this.state.neutral}
                      status ={this.state.status}/>
    )
  }
}
export default Sentiment;
