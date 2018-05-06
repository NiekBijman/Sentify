import React from 'react';
import Map from './map';
import Search from './search';
import SentimentContainer from './sentiment';
import { Steps } from 'intro.js-react';
import ButtonImportant from '../components/button-important';
import { modelInstance } from '../model/model';


import 'intro.js/introjs.css';
import '../styles/discover.css';
import '../styles/search.css';


class DiscoverContainer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            status: 'INITIAL',

            //Intro.js
            initialStep: 0,
            steps: [
              {
                element: '.sentiment-pie',
                intro: 'This app measures the <strong>Sentiment</strong> of tweets <button>Source</button>',
              },
              {
                element: '.search',
                intro: 'Input queries, location and date as parameters',
              },
            ],
        }
    }

    handleStatusChange = newStatus => {
      this.setState({
          status: newStatus
      });
    }

    onExit = () => {
      this.setState(() => ({ stepsEnabled: false }));
    };

    toggleSteps = () => {
      this.setState(prevState => ({ stepsEnabled: !prevState.stepsEnabled }));
    };

    render () {
      const { stepsEnabled, steps, initialStep} = this.state;

        return (
            <div className="container-discover">
              <Steps
                enabled={stepsEnabled}
                steps={steps}
                initialStep={initialStep}
                onExit={this.onExit}
              />
              <div className="container-discover-top">
                  <div className='map'>
                    <Map/>
                  </div>
                  <div className="intro">
                      <ButtonImportant size="small" text='Explain App' toggleSteps={this.toggleSteps.bind(this)}/>
                  </div>
                  <div className='container-search'>
                    <Search handleStatusChange={this.handleStatusChange}/>
                  </div>
              </div>
              <div className="container-discover-bottom">
                  <SentimentContainer status={this.state.status} notifications={this.state.notification}/>
              </div>
            </div>

        );
    }
}

export default DiscoverContainer;
