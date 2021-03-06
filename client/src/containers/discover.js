import React from 'react';
import Map from './map';
import Search from './search';
import SentimentContainer from './sentiment';
import { Steps } from 'intro.js-react';
import { modelInstance } from '../model/model';
import DrawingAnimation from '../components/intro-drawing-animation'
import {withRouter} from 'react-router';
import Login from '../login';
import { Row, Col } from 'react-flexbox-grid';

import 'intro.js/introjs.css';
import '../styles/discover.css';
import '../styles/search.css';

class DiscoverContainer extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            status: 'NULL',
            searchInput: "",
            mySearchLoaded: false,

            //Intro.js
            initialStep: 0,
            introState: 'INITIAL',
            steps: [
              {
                element: '.sentiment-pie',
                intro: "This app shows sentiment towards subjects based on tweets. </br> <h5><ButtonImportant><a target='_blank' href='https://en.wikipedia.org/wiki/Sentiment_analysis'>What is Sentiment Analysis?</a></ButtonImportant></h5> <h6><i>*Tweets without sentiment are not included in the chart</i></h6>",
              },
              {
                element: '#searchInput',
                intro: 'You can search for subjects here',
              },
              {
                element: '.date',
                intro: 'You can look for tweets in the past 7 days',
              },
              {
                element: '.location',
                intro: 'You can filter your search to specific locations',
              },
              {
                element: '.container-discover-top',
                intro: 'Or interact with the map to look for locations in a certain radius',
              },
              {
                element: '.sentiment-tweet',
                intro: 'The tweets will be displayed here',
              },
              {
                element: '.createPDF',
                intro: 'Finally you can export the data in a PDF',
              },
            ],
        }
    }

    componentDidMount() {
      let searchObject = modelInstance.getMySearchesParams(); // function that gets search params and eliminates them from localStorage

      if(searchObject){
        this.state.mySearchLoaded = true;
        console.log(searchObject);
        this.setState({
          searchID: searchObject.searchID,
          status: "LOADED",
          positive: searchObject.positive,
          negative: searchObject.negative,
          total: searchObject.total,
          noOfNeutral: searchObject.noOfNeutral,
          until: searchObject.until,
          placeName: searchObject.location,
          searchInput: searchObject.query
        });
        modelInstance.setSearch(searchObject.query, true);
        modelInstance.setPlaceName(searchObject.location, true);
      } else{
        modelInstance.setSearchParamsFromLocalStorage();
        modelInstance.searchTweets();
      }
    }

    handleStatusChange = newStatus => {
      this.setState({
          status: newStatus
      });
    }

    onExit = () => {
      this.setState(() => ({
        stepsEnabled: false,
        introState: 'INITIAL'
      }));
    };

    toggleSteps = () => {
      this.setState(prevState => ({ stepsEnabled: !prevState.stepsEnabled }));
    };

    onAfterChange = nextStepIndex => {
      if (nextStepIndex === 0 && this.state.status !=='LOADED') {
        this.setState({
          status: 'LOADED'
        })
      }

      else if (nextStepIndex === 4) {
        this.setState({
          introState: 'MAP'
        })
      }

      else {
        this.setState({
          introState: 'INITIAL'
        })
      }
    }

    render () {
      const { stepsEnabled, steps, initialStep} = this.state;

      let media = null;

      switch (this.state.introState) {
        case 'INITIAL':
            media = null
            break;
        case 'MAP':
            media = <DrawingAnimation />
          break;
        default:
          break;
      }

        return (
            <div className="container-discover">
              <Steps
                className='intro-steps'
                enabled={stepsEnabled}
                steps={steps}
                initialStep={initialStep}
                onExit={this.onExit}
                onAfterChange={this.onAfterChange}
              />
              <div className="container-discover-top">
                  <div className='map'>
                    <Map/>
                  </div>
                  <Row className="discover-top">
                    <Col xs={12} sm={12} md={8} className="hidden-xl hidden-lg hidden-md visible-sm visible-xs">
                      <div className="intro">
                          {media}
                          <Login toggleSteps={this.toggleSteps.bind(this)}/>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={4}>
                      <div className='container-search'>
                        <Search handleStatusChange={this.handleStatusChange} searchInput={this.state.searchInput}/>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={8} className="hidden-sm hidden-xs">
                      <div className="intro">
                          {media}
                          <Login toggleSteps={this.toggleSteps.bind(this)}/>
                      </div>
                    </Col>
                  </Row>
              </div>
              <div className="container-discover-bottom">
                  <SentimentContainer query={this.state.searchInput}
                                      status={this.state.status}
                                      positive={this.state.positive}
                                      negative={this.state.negative}
                                      total={this.state.total}
                                      noOfNeutral={this.state.noOfNeutral}
                                      until={this.state.until}
                                      placeName={this.state.placeName}
                                      searchID={this.state.searchID}
                                      mySearchLoaded={this.state.mySearchLoaded}/>
              </div>
            </div>

        );
    }
}

export default withRouter(DiscoverContainer);
