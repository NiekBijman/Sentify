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
      sentiment: modelInstance.getSentimentData(),
      searchInput: modelInstance.getSearch(),
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
    let result = modelInstance.getSentimentData();
    // if(result !== null){
    //   console.log(result);
    // }

    this.setState({
      positive: (result !== null) ? Math.round(result.positive*100) : 50,
      negative:  (result !== null) ? Math.round(result.negative*100) : 40,
      neutral: (result !== null) ? Math.round(result.neutral*100) : 10,
      searchInput: modelInstance.getSearch(),
    })
      // }
  }

  componentDidMount = () => {
    // this.dataCount();
    modelInstance.addObserver(this);
  }
  // componentWillUnmount = () => {
  //   modelInstance.removeObserver(this);
  // }

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
            <div className="tweets-info">
              <Row>
                <Col xs={6} className="tweets-info-title">Search:</Col>
                <Col xs={6} className="tweets-info-value">{this.state.searchInput}</Col>
              </Row>
              <Row>
                <Col xs={6} className="tweets-info-title">Amount of tweets:</Col>
                <Col xs={6} className="tweets-info-value">100</Col>
              </Row>
              <Row>
                <Col xs={6} className="tweets-info-title">Geography:</Col>
                <Col xs={6} className="tweets-info-value">World</Col>
              </Row>
              <Row>
                <Col xs={6} className="tweets-info-title">Date Range:</Col>
                <Col xs={6} className="tweets-info-value">14-04-2018 / 20-04-2018</Col>
              </Row>
              <Row>
                <Col xs={6} className="tweets-info-title">Timestamp:</Col>
                <Col xs={6}className="tweets-info-value">28-02-2018</Col>
              </Row>
            </div>
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
