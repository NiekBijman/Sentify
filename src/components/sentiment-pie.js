import React, { Component } from 'react';
import PieChart from 'react-simple-pie-chart';
import '../styles/sentiment-pie.css';
import Sentiment from '../containers/sentiment';

//This is the Presentation component
const SentimentPie = ({positive, negative, neutral, status}) =>
  <React.Fragment>
         <PieChart slices={[
               {
                 color: '#fce176',
                 value: neutral
               },
               {
                 color: '#94fc9d',
                 value: negative
               },
               {
                 color: '#ed3b41',
                 value: positive
               },
             ]}
           />
  </React.Fragment>

  export default SentimentPie;

// console.log(negative);
// let pieChart = null;
//
//   switch (status){
//     case 'INITIAL':
//           pieChart =  <em>Loading ...</em>
//           break;
//     case 'LOADED':
//           pieChart =
//           <React.Fragment>
//              <PieChart slices={[
//                    {
//                      color: '#f00',
//                      value: negative
//                    },
//                    {
//                      color: '#0f0',
//                      value: positive
//                    },
//                  ]}
//                />
//            </React.Fragment>
//      case 'ERROR':
//           window.alert("Hey! There seems to be an error in your request ")
//           break;
//
//      default:
//           pieChart = <b>Failed to load data, please try again</b>
//           break;
//     }
//     return(
//       {pieChart}
//       )
