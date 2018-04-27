import React from 'react';
import './styles/my-searches.css';
import MySearchesContainer from './containers/my-searches';
import { modelInstance } from './model/model';

class MySearches extends React.Component {
    render () {
        return (
            <div>      
                <MySearchesContainer model={modelInstance}/>
            </div>
        );
    }
}

export default MySearches;