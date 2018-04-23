import React, { Component } from 'react';
import Hidden from 'material-ui/Hidden';
import { Row, Col } from 'react-flexbox-grid';
import SentimentPie from '../components/sentiment-pie';
import { modelInstance } from '../model/model';
import Dimensions from 'react-dimensions';
import PropTypes from 'prop-types';

class SentimentView extends Component {
  constructor(props){
    super(props)
    this.state = {
      status: 'INITIAL',
      positive: 50,
      negative: 50,
      neutral: 0,
      sentiment: modelInstance.getSentimentData(),
      searchInput: modelInstance.getSearch(),
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
            <svg width="100%" height="100%">
              <SentimentPie x={x}
                            y={y}
                            innerRadius={radius * .35}
                            outerRadius={radius}
                            cornerRadius={7}
                            padAngle={.02}
                            data={[this.state.positive, this.state.negative, this.state.neutral]}/>
            </svg>
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
export default Dimensions()(SentimentView);
