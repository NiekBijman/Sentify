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
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import Tooltip from 'material-ui/Tooltip';


class Sentiment extends Component {
  constructor(props){
    super(props);
    let tweetID = modelInstance.getMostPopularTweet();
    if (tweetID === null) tweetID = "692527862369357824";
    this.state = {
      positive: 60,
      negative: 40,
      // neutral: 10,
      quantity:'',
      sentiment: modelInstance.getSentimentData(),
      searchInput: modelInstance.getSearch(),
      placeName: modelInstance.getPlaceName(),
      tweetAmount: modelInstance.getTweetAmount(),
      until: '',
      geoLocated: null,
      tweetID: tweetID+"",
      openPDFModal: false,
      notifications: 'INITIAL',
      openNotification: false,
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
      let mostPopularID = modelInstance.getMostPopularTweet();
      this.setState({tweetID: mostPopularID});
    }

    if (details==="sentimentSet") {
      this.calculateSentiment();
      this.setState({
        searchInput: modelInstance.getSearch(),
        tweetAmount: modelInstance.getTweetAmount(),
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

    if(details==='geoIDSet'){
      this.setState({
        tweetID: modelInstance.getGeoTweetID()
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

    if(details ==='placeNameReset'){
        this.setState({
          placeName: ''
        })
    }

    //Notifications
    if(details==="networkError"){
      this.setState({
        notifications:'ERROR',
        openNotification: true
      });
    }

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

    if(details==="locationNotFound"){
      this.setState({
        notifications:'NO_LOCATION',
        openNotification: true
      });
    }
    if(details==="signInFailed"){
      this.setState({
        notifications:'SIGN_IN_FAILED',
        openNotification: true
      });
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
    sentiment.positive = (pos/(pos+neg))*100;
    sentiment.negative = (neg/(pos+neg))*100;
    // sentiment.neutral = (neu/total)*100;

    this.setState({
      positive: (result !== null) ? Math.round(sentiment.positive) : 60,
      negative:  (result !== null) ? Math.round(sentiment.negative) : 40,
      quantity:  (neu + '/' + total),
      // neutral: (result !== null) ? Math.round(sentiment.neutral) : 10,
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

  handleChartClick = () => {
    console.log('hey');
  }

  handleNavigation = navigate => {
    let currentTweet = modelInstance.pickTweet(navigate);
    if(currentTweet !== null){
      this.setState({ tweetID: currentTweet.id_str});
      }
  }

  saveSearch = () => {
    modelInstance.addSearchToDB(this.state.positive, this.state.negative);

    this.setState({
      notifications: 'SEARCH_SAVED',
      openNotification: true,
    })
  }

  render(){
    let width = this.props.containerWidth / 3;
    let height = this.props.containerHeight;
    let minViewportSize = Math.min(width, height);
    // This sets the radius of the pie chart to fit within
    // the current window size, with some additional padding
    let radius = (minViewportSize * 1.1) / 2;
    // Centers the pie chart
    let x = width / 2;
    let y = height / 2;
    let pieChart = null;
    let notification = null;

    switch (this.props.status) {
      case 'NULL' :
        pieChart = null;
        break;

      case 'INITIAL':
        pieChart = <CircularIndeterminate/>
        break;
      case 'LOADED':
        pieChart =
              <svg onClick={this.handleChartClick} width="120%" height="120%">
                <SentimentPie x={x}
                              y={y}
                              innerRadius={radius * .00}
                              outerRadius={radius}
                              cornerRadius={2}
                              padAngle={.00}
                              data={[this.state.positive, this.state.negative]}/>
              </svg>
        break;
    }

    // Error Messages for App 'misuses'
    switch (this.state.notifications) {
      case 'INITIAL':
        notification = null;
      break;
      case 'ERROR':
        notification = <Notification text='Failed to load data, please try again' open={this.state.openNotification} handleClose={this.handleClose}/>
      break;
      case 'NO_TWEETS':
        notification = <Notification text="We couldn't find any tweets for that search" open={this.state.openNotification} handleClose={this.handleClose}/>
      break;
      case 'NO_SEARCH':
        notification = <Notification text="Please input a search query" open={this.state.openNotification} handleClose={this.handleClose}/>
      break;
      case 'RATE_LIMITED':
        notification = <Notification text="Can't update location because the App has been Rate Limited by Twitter" open={this.state.openNotification} handleClose={this.handleClose}/>
      break;
      case 'NO_LOCATION':
      notification = <Notification text="We couldn't find that location" open={this.state.openNotification} handleClose={this.handleClose}/>
      break;
      case 'SEARCH_SAVED':
      notification = <Notification text="Search saved" open={this.state.openNotification} handleClose={this.handleClose} />
      break;
      case 'SIGN_IN_FAILED':
      notification = <Notification
                      text="Unable to login. Please change your browser cookie settings"
                      // action = {
                      //   <Button href='chrome://settings/content/cookies' color="secondary" size="small">
                      //     Chrome Cookie Settings
                      //   </Button>
                      // }
                      open={this.state.openNotification}
                      handleClose={this.handleClose}
                      notifications={this.state.notifications} />
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
                <Button className="sentiment-save" onClick={this.saveSearch}>Save Search</Button>
              <Row>
                <Col xs={6} className="tweets-info-title">Search:</Col>
                <Col xs={6} className="tweets-info-value">{this.state.searchInput}</Col>
              </Row>
              <Row>
                <Col xs={6} className="tweets-info-title">Tweets with sentiment:</Col>
                <Col xs={6} className="tweets-info-value">{this.state.quantity}</Col>
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
            {/* <Button variant="raised" onClick={this.chooseTweet}>New Tweet</Button> */}
            <Row>
              <Col className='sentiment-tweet-navigate' sm={1} md={1} xs={0}>
                <Tooltip id="tooltip-icon" title="Previous Tweet">
                  <NavigateBefore onClick={ () => {this.handleNavigation('previous')}} aria-label="navigate_before" disabled={true}/>
                </Tooltip>
              </Col>

              <Col sm={10} md={10} xs={12}>
                <TweetEmbed className="sentiment-tweet" id={this.state.tweetID} options={{width:'100', cards: 'hidden'}} onTweetLoadError={evt => this.handleTweetLoadError(evt)} onTweetLoadSuccess={evt => this.handleTweetLoadSuccess(evt)}/>
              </Col>

              <Col className='sentiment-tweet-navigate' sm={1} md={1} xs={0}>
                <Tooltip id="tooltip-icon" title="Next Tweet">
                  <NavigateNext onClick={ () => {this.handleNavigation('next')}} aria-label="navigate_next" disabled={false}/>
                </Tooltip>
              </Col>
            </Row>
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
