import React from 'react';
import Map from './map';
import Search from './search';
import SentimentContainer from './sentiment';

class DiscoverContainer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            status: 'INITIAL',
        }
    }

    handleStatusChange = newStatus => {
        this.setState({
            status: newStatus
        });
    }

    render () {
        return (
            <div className="container-discover">
            <div className="container-discover-top">
                <div className='map'>
                <Map/>
                </div>
                <div className='container-search'>
                <Search handleStatusChange={this.handleStatusChange}/>
                </div>
            </div>
            <div className="container-discover-bottom">
                <SentimentContainer status={this.state.status}/>
            </div>
            </div>
        );
    }
}

export default DiscoverContainer;
