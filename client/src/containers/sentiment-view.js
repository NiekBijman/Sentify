import React, { Component } from 'react';
import Hidden from 'material-ui/Hidden';
import { Row, Col } from 'react-flexbox-grid';
import SentimentPie from '../components/sentiment-pie';
import { modelInstance } from '../model/model';

class SentimentView extends Component {
  constructor(props){
    super(props)
    this.state = {
      status: 'INITIAL',
      positive: 50,
      negative: 40,
      neutral: 10,
      sentiment: modelInstance.getSentimentData()
    }
  }

  componentDidMount() {
    modelInstance.addObserver(this);
  }

  componentWillUnmount() {
    modelInstance.removeObserver(this);
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
      <div className="container-discover-bottom">
        <Hidden only="xs">
          <Row id="title-steps">
            <Col sm={4} md={4}>Tweets</Col>
            <Col sm={4} md={4}>Sentiment</Col>
            <Col sm={4} md={4}>Most Popular</Col>
          </Row>
        </Hidden>
        <Row id="content-steps">
          <Col sm={4} md={4} xs={12}>
            <Hidden smUp>
              <p>Tweets</p>
            </Hidden>
          </Col>
          <Col sm={4} md={4} xs={12}>
            <Hidden smUp>
              <p>Sentiment</p>
            </Hidden>
            <SentimentPie positive = {this.state.positive}
              negative = {this.state.negative}
              neutral = {this.state.neutral}
              status ={this.state.status}/>
          </Col>
          <Col sm={4} md={4} xs={12}>
            <Hidden smUp>
              <p>Most Popular</p>
            </Hidden>
          </Col>
        </Row>
      </div>
    );
  }
}
export default SentimentView;

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