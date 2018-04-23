import React from 'react';
import './styles/my-searches.css';
import MySearchesView from './containers/my-searches-view';
import { modelInstance } from './model/model';

class MySearches extends React.Component {
    render () {
        return (
            <div>      
                <MySearchesView model={modelInstance}/>
            </div>
        );
    }
}

export default MySearches;