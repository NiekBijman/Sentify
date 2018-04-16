import React, { Component } from 'react';
import PieChart from 'react-simple-pie-chart';
import SentimentPie from '../components/sentiment-pie';
import { modelInstance } from '../model/model'
import '../styles/sentiment-pie.css';

class Sentiment extends Component {
  constructor(props){
    super(props)
    this.state = {
      status: 'INITIAL',
      positive: null,
      negative: null,
      neutral: null,
      sentiment: modelInstance.getSentimentData()
    }
  }

  update(details){
      // if (details==="tweetSearch") {
      console.log(modelInstance.getSentimentData());
      this.setState({
        positive: Math.round(modelInstance.getSentimentData().positive*100),
        negative:  Math.round(modelInstance.getSentimentData().negative*100),
        neutral: Math.round(modelInstance.getSentimentData().neutral*100),

      })
      // }
    }

  componentDidMount = () => {
    // this.dataCount();
    modelInstance.addObserver(this);

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



// dataCount = () => {
//     var positive = 0;
//     var negative = 0;
//     var neutral = 0;
//
//       var count = this.state.result.data.map((data) => {
//             if(data.polarity === 4){
//               positive = positive + 1;
//               return positive;
//             }
//             if(data.polarity === 0){
//               negative = negative + 1;
//               return negative;
//             }
//             if(data.polarity === 2){
//               neutral = neutral + 1;
//               return neutral;
//             }
//           }
//         )
//     this.percentage( positive, negative, neutral);
//   }
//
// percentage(negative, positive, neutral){
//   var total = positive + negative + neutral;
//
//   this.setState({
//     positive: (positive / total) * 100,
//     negative: (negative / total) * 100,
//     neutral: (neutral / total) * 100
//   })
// }
