import React, { Component } from 'react';
import PieChart from 'react-simple-pie-chart';
import './Pie.css';

class Pie extends Component {
  constructor(props){
    super(props)
    this.state = {
      status: 'INITIAL',
      data: '',
      positive: null,
      negative: null,
      neutral: null,
      callBack: {"data": [{"text": "I love Titanic.", "id":1234, "polarity": 4},
                {"text": "I love Titanic.", "id":1234, "polarity": 4},
                {"text": "I don't mind Titanic.", "id":1234, "polarity": 2},
                {"text": "I don't mind Titanic.", "id":1234, "polarity": 2},
                {"text": "I hate Titanic.", "id":4567, "polarity": 0}]}
    }
  }

  dataCount = () => {
      var positive = 0;
      var negative = 0;
      var neutral = 0;

        var count = this.state.callBack.data.map((data) => {
              if(data.polarity === 4){
                positive = positive + 1;
                return positive;
              }
              if(data.polarity === 0){
                negative = negative + 1;
                return negative;
              }
              if(data.polarity === 2){
                neutral = neutral + 1;
                return neutral;
              }
            }
          )
      this.piePercentage( positive, negative, neutral);
    }

    piePercentage(negative, positive, neutral){
      var total = positive + negative + neutral;

      this.setState({
        positive: (positive / total) * 100,
        negative: (negative / total) * 100,
        neutral: (neutral / total) * 100
      })
    }

  componentDidMount = () => {
    this.dataCount();

    this.setState({
        status: 'LOADED'
      })
    // // API Call should be made here, for now it's hardcoded
    // model.sentimentAnalysis().then(callBack => {
    //   this.setState({
    //     status: 'LOADED',
    //     // callBack:
    //   })
    //
    // }).catch(() => {
    //   this.setState({
    //     status: 'ERROR'
    //     })
    //   })
  }

  render(){
    return(
        <PieView positive = {this.state.positive}
                 negative = {this.state.negative}
                 neutral = {this.state.neutral}
                 status ={this.state.status}/>
    )
  }
}
export default Pie;

//This is the Presentation component
const PieView = ({positive, negative, neutral, status}) =>
  <React.Fragment>
    <div className ='row'>
      <div className='col-xs-6'>
          <input></input>
      </div>
      <div className='col-xs-6'>
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
       </div>
     </div>
  </React.Fragment>

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
