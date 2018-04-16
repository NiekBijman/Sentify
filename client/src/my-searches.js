import React from 'react';
import './styles/my-searches.css';
import MySearchesView from './containers/my-searches-view';
import { modelInstance } from './model/model';

const MySearches = ({}) =>
    <div>      
        <MySearchesView model={modelInstance}/>
    </div>

export default MySearches;