import React, { Component } from 'react';
import Hidden from 'material-ui/Hidden';
import Button from 'material-ui/Button';
import { Row, Col } from 'react-flexbox-grid';
import SentimentPie from '../components/sentiment-pie';
import CircularIndeterminate from '../components/circular-indeterminate';
import SentimentPDF from '../components/sentiment-pdf';
import CreatePDFModal from '../components/create-pdf-modal';
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
    let tweetID = modelInstance.randomDrawTweet();
    if (tweetID === null) tweetID = "692527862369357824";
    this.state = {
      positive: 50,
      negative: 40,
      neutral: 10,
      sentiment: modelInstance.getSentimentData(),
      searchInput: modelInstance.getSearch(),
      placeName: modelInstance.getPlaceName(),
      tweetAmount: modelInstance.getTweetAmount(),
      until: modelInstance.getDateString(),
      geoLocated: null,
      tweetID: tweetID+"",
      openPDFModal: false,
      notifications: 'INITIAL',
      openNotification: false
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
    if(details === "searchInputSet"){
      this.setState({
        searchInput: modelInstance.getSearch()
      });
    }

    if(details ==='tweetsSet'){
      // console.log("The tweets");
      // console.log(modelInstance.getTweets());
      let randomTweetID = modelInstance.randomDrawTweet().id_str;
      this.setState({tweetID: randomTweetID});
      this.sentimentAnalysis();
      // Set state to LOADING, which should disable save-search button
    }

    if (details==="sentimentSet") {
      this.calculateSentiment();
      this.setState({
        searchInput: modelInstance.getSearch(),
        tweetAmount: modelInstance.getTweetAmount(),
        mostPopularTweetId: modelInstance.getMostPopularTweet(),
      })
    }

    if(details==='userLocationsSet'){
      let userLocations = modelInstance.getUserLocations();
      let length;
      if(userLocations !== null){
        length = userLocations.locations.length;
      }else{
        length = ""
      }
      this.setState({
        geoLocated: length
      })
    }

    if(details==='tweetIDSet'){
      this.setState({
        tweetID: modelInstance.getTweetID()
      })
    }

    if(details === "dateSet"){
      this.setState({
        until: modelInstance.getDateString()
      });
    }

    if(details==="placeNameSet"){
      this.setState({
        placeName: modelInstance.getPlaceName()
      });
    }

    //Notifications
    if(details==="noTweetsFound"){

      this.setState({
        notifications:'NO_TWEETS',
        openNotification: true
      });
    }

    if(details==="noSearchInputGiven"){
      // Notify user that he/she needs to input a search
      this.setState({
        notifications: "NO_SEARCH",
        openNotification: true
      });
    }

    if(details==="rateLimited"){
      this.setState({
        notifications:'RATE_LIMITED',
        openNotification: true
      });
    }
  }

  sentimentAnalysis = () => {
    // if(this.state.searchInput === "") return;

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
    // console.log('Tweet loaded successfully');
  }

  handlePDFCreation = event => {
    let input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save(this.state.searchInput + ".pdf");
      });
  }

  handleOpenNotification = () => {
    this.setState({ openNotification: true});
  };

  handleClose = () => {
    this.setState({ openNotification: false });
  };

  handleOpenPDFModal = () => {
    this.setState({
        openPDFModal: true
    });
  }

  handleClosePDFModal = () => {
    this.setState({
        openPDFModal: false
    });
  };


  newRandomTweet = () => {
    let randomTweet = modelInstance.randomDrawTweet();
    if (randomTweet === null) return;
    let randomTweetID = randomTweet.id_str;
    this.setState({tweetID: randomTweetID});
  }

  saveSearch = () => {
    modelInstance.addSearchToDB(this.state.positive, this.state.negative, this.state.neutral);
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
    let notification = null;

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



        case 'ERROR':
        pieChart = <Notification
                    open={this.state.openNotification}
                    handleClose={this.handleClose}
                    text='Failed to load data, please try again'/>
        break;
    }

    // Error Messages for App 'misuses'
    switch (this.state.notifications) {
      case 'INITIAL':
        notification = null;
      break;

      case 'NO_TWEETS':

      console.log("NO_TWEETS")
        notification = <Notification
                        open={this.state.openNotification}
                        handleClose={this.handleClose}
                        text="We couldn't find any tweets for that search"
                      />

      break;

      case 'NO_SEARCH':

        console.log("NO_SEARCH")
        notification = <Notification
                        open={this.state.openNotification}
                        handleClose={this.handleClose}
                        text="Please input a search query"
                      />

      break;

      case 'RATE_LIMITED':

        console.log('RATE_LIMITED')
        notification = <Notification
                          open={this.state.openNotification}
                          handleClose={this.handleClose}
                          text="Can't update location because the App has been Rate Limited by Twitter"
                        />
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
                <SentimentPDF handlePDFCreation={this.handleOpenPDFModal} page={0}/>
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
                <Col xs={6} className="tweets-info-title">Until:</Col>
                <Col xs={6} className="tweets-info-value">{this.state.until}</Col>
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
            {notification}
          </Col>
          <Col sm={4} md={4} xs={12} className="tweet">
            <Hidden smUp>
              <p>Tweets</p>
              <div className="createPDF">
                <SentimentPDF handlePDFCreation={this.handleOpenPDFModal} page={0}/>
              </div>
            </Hidden>
            <Button onClick={this.saveSearch}>Save Search</Button>
            <Button variant="raised" onClick={this.newRandomTweet}>New Tweet</Button>
            <TweetEmbed id={this.state.tweetID} options={{cards: 'hidden', width: '100%'}} onTweetLoadError={evt => this.handleTweetLoadError(evt)} onTweetLoadSuccess={evt => this.handleTweetLoadSuccess(evt)}/>
          </Col>
        </Row>
        <CreatePDFModal
          open={this.state.openPDFModal}
          handleClose={this.handleClosePDFModal}
          handleSavePDF={this.handlePDFCreation}
          searchInput={this.state.searchInput}
          tweetAmount={this.state.tweetAmount}
          placeName={this.state.placeName}
          date={this.state.until}
          pieChart={pieChart}
        />
      </div>
    );
  }
}
export default Dimensions()(Sentiment);
