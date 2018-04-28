import React, { Component } from 'react';
import Hidden from 'material-ui/Hidden';
import { Row, Col } from 'react-flexbox-grid';
import SentimentPie from '../components/sentiment-pie';
import { modelInstance } from '../model/model';
import Dimensions from 'react-dimensions';
import PropTypes from 'prop-types';
import TweetEmbed from 'react-tweet-embed';

class Sentiment extends Component {
  constructor(props){
    super(props);
    this.state = {
      positive: 50,
      negative: 40,
      neutral: 10,
      sentiment: modelInstance.getSentimentData(),
      searchInput: "All Tweets",
      placeName: modelInstance.getPlaceName(),
      tweets: modelInstance.getTweetAmount(),
    }
  }

  static propTypes = {
    containerWidth: PropTypes.number.isRequired,
    containerHeight: PropTypes.number.isRequired
  }

  componentDidMount() {
    modelInstance.addObserver(this);
  }

  componentWillUnmount() {
    modelInstance.removeObserver(this);
  }

  update(details){
    if (details==="sentimentSet") {
      this.calculateSentiment();
      this.setState({
        searchInput: modelInstance.getSearch(),
        placeName: modelInstance.getPlaceName(),
        tweets: modelInstance.getTweetAmount()
      })
    }
  }

  calculateSentiment = () => {
    let result = modelInstance.getSentimentData();
    let sentiment = {positive: undefined, negative: undefined, neutral: undefined};
    let pos = 0;
    let neg = 0;
    let neu = 0;


    result.data.map(data =>{
      switch(data.polarity){
        case 4:
          pos += 1
          break
        case 0:
          neg += 1
          break
        case 2:
          neu += 1
          break
      }
    })

    let total = pos + neg + neu;
    sentiment.positive = (pos/total)*100;
    sentiment.negative = (neg/total)*100;
    sentiment.neutral = (neu/total)*100;

    this.setState({
      positive: (result !== null) ? Math.round(sentiment.positive) : 50,
      negative:  (result !== null) ? Math.round(sentiment.negative) : 40,
      neutral: (result !== null) ? Math.round(sentiment.neutral) : 10,
    })
  }

  handleTweetLoadError = event => {
    console.log('Tweet loading failed');
  }

  handleTweetLoadSuccess = event => {
    console.log('Tweet loaded successfully');
  }

  render(){
    let width = this.props.containerWidth / 3;
    let height = this.props.containerHeight;
    let minViewportSize = Math.min(width, height);
    // This sets the radius of the pie chart to fit within
    // the current window size, with some additional padding
    let radius = (minViewportSize * .9) / 2;
    // Centers the pie chart
    let x = width / 2;
    let y = height / 2;
    let pieChart = null;

    switch (this.props.status) {
      case 'INITIAL':
        pieChart = <div className="modal_loading"></div>
        break;
      case 'LOADED':
        pieChart =
            <svg width="100%" height="100%">
              <SentimentPie x={x}
                            y={y}
                            innerRadius={radius * .35}
                            outerRadius={radius}
                            cornerRadius={7}
                            padAngle={.02}
                            data={[this.state.positive, this.state.negative, this.state.neutral]}/>
            </svg>
        break;
      default:
        pieChart = <div className="error">Failed to load data, please try again</div>
        break;
    }

    return(
      <div>
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
                <Col xs={6} className="tweets-info-value">{this.state.tweets}</Col>
              </Row>
              <Row>
                <Col xs={6} className="tweets-info-title">Geography:</Col>
                <Col xs={6} className="tweets-info-value">{this.state.placeName}</Col>
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
          <Col sm={4} md={4} xs={12}
            style={{
              width: this.props.containerWidth,
              height: this.props.containerHeight
            }}
            className="sentiment-pie"
          >
            <Hidden smUp>
              <p>Sentiment</p>
            </Hidden>
            {pieChart}
          </Col>
          <Col sm={4} md={4} xs={12}>
            <Hidden smUp>
              <p>Most Popular</p>
            </Hidden>
            <TweetEmbed id='692527862369357824' options={{cards: 'hidden' }} onTweetLoadError={evt => this.handleTweetLoadError(evt)} onTweetLoadSuccess={evt => this.handleTweetLoadSuccess(evt)}/>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Dimensions()(Sentiment);
