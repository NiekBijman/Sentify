import React, { Component } from 'react';
import Hidden from 'material-ui/Hidden';
import { Row, Col } from 'react-flexbox-grid';
import SentimentPie from '../components/sentiment-pie';
import CircularIndeterminate from '../components/circular-indeterminate';
import SentimentPDF from '../components/sentiment-pdf';
import { modelInstance } from '../model/model';
import Dimensions from 'react-dimensions';
import PropTypes from 'prop-types';
import TweetEmbed from 'react-tweet-embed';
import Notification from '../components/notification';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
      tweetAmount: modelInstance.getTweetAmount(),
      geoLocated: null,
      userId: '692527862369357824'
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
    if(details ==='tweetsSet'){
      this.sentimentAnalysis();
    }

    if (details==="sentimentSet") {
      this.calculateSentiment();
      this.setState({
        searchInput: modelInstance.getSearch(),
        placeName: modelInstance.getPlaceName(),
        tweetAmount: modelInstance.getTweetAmount(),
        mostPopularTweetId: modelInstance.getMostPopularTweet(),
      })
    }

    if(details==="emptySearch"){
      this.setState({
        status: 'EMPTY'
      });
    }

    if(details==='userLocationsSet'){
      this.setState({
        geoLocated: modelInstance.getUserLocations().locations.length
      })
    }

    if(details==='userIdSet'){
      this.setState({
        userId: modelInstance.getUserId()
      })
    }
  }

  sentimentAnalysis = () => {
      modelInstance.analyzeSentiment().then(result => {
        modelInstance.setSentimentData(result);
        this.setState({
          status: 'LOADED SENTIMENT'
        });
      }).catch(() => {
        this.setState({
          status: 'ERROR'
        });
    });
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

  handlePDFCreation = event => {
    let input = document.getElementById('divToPrint');
    input.style.display = 'block';
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        input.style.display = 'none';
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save(this.state.searchInput + ".pdf");
      });
  }

  showNotification = () => {
    this.setState({ open: true});
  };

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
        pieChart = <CircularIndeterminate/>
        break;
      case 'LOADED':
        pieChart =
            <svg width="100%" height="100%">
              <SentimentPie x={x}
                            y={y}
                            innerRadius={radius * .35}
                            outerRadius={radius}
                            cornerRadius={2}
                            padAngle={.02}
                            data={[this.state.positive, this.state.negative, this.state.neutral]}/>
            </svg>
        break;

      case 'EMPTY':
        pieChart = <Notification open={this.showNotification} text="We couldn't find any tweets for that search"/>
      break;

      default:
        pieChart = <Notification open={this.showNotification} text='There seems to be an error in your request'/> //  <div className="error">Failed to load data, please try again</div>
        break;
    }

    return(
      <div>
        <Hidden only="xs">
          <Row id="title-steps">
            <Col sm={4} md={4}>Info</Col>
            <Col sm={4} md={4}>Sentiment</Col>
            <Col sm={4} md={4}>
              Tweets
              <div className="createPDF">
                <SentimentPDF handlePDFCreation={this.handlePDFCreation} page={0}/>
              </div>
            </Col>
          </Row>
        </Hidden>
        <Row id="content-steps">
          <Col sm={4} md={4} xs={12}>
            <Hidden smUp>
              <p>Info</p>
            </Hidden>
            <div className="tweets-info">
              <Row>
                <Col xs={6} className="tweets-info-title">Search:</Col>
                <Col xs={6} className="tweets-info-value">{this.state.searchInput}</Col>
              </Row>
              <Row>
                <Col xs={6} className="tweets-info-title">Amount of tweets:</Col>
                <Col xs={6} className="tweets-info-value">{this.state.tweetAmount}</Col>
              </Row>
              <Row>
                <Col xs={6} className="tweets-info-title">Geolocated Tweets:</Col>
                <Col xs={6} className="tweets-info-value">{this.state.geoLocated}</Col>
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
          <Col sm={4} md={4} xs={12} className="tweet">
            <Hidden smUp>
              <p>Tweets</p>
              <div className="createPDF">
                <SentimentPDF handlePDFCreation={this.handlePDFCreation} page={0}/>
              </div>
            </Hidden>
            <TweetEmbed id={this.state.userId} options={{cards: 'hidden', width: '100%'}} onTweetLoadError={evt => this.handleTweetLoadError(evt)} onTweetLoadSuccess={evt => this.handleTweetLoadSuccess(evt)}/>
          </Col>
        </Row>
        <div id="divToPrint">
          <div className="tweets-info">
            <h2>{this.state.searchInput}</h2>
            <Row>
              <Col xs={6} className="tweets-info-title">Amount of tweets:</Col>
              <Col xs={6} className="tweets-info-value">{this.state.tweetAmount}</Col>
            </Row>
            <Row>
              <Col xs={6} className="tweets-info-title">Location:</Col>
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
            {pieChart}
          </div>
        </div>
      </div>
    );
  }
}
export default Dimensions()(Sentiment);
