import React from 'react';
import PieChart from 'react-simple-pie-chart';
import '../styles/sentiment-pie.css';
import { Row, Col } from 'react-flexbox-grid';

//This is the Presentation component
class SentimentPie extends React.Component {
  render () {
    return (
      <PieChart slices={[
          {
            color: '#fce176',
            value: this.props.neutral
          },
          {
            color: '#94fc9d',
            value: this.props.positive
          },
          {
            color: '#ed3b41',
            value: this.props.negative
          },
        ]}
      />
    );
  }
}

export default SentimentPie;

// render () {
//   let pieChart = null;

//   switch (this.props.status) {
//     case 'INITIAL':
//         pieChart = <div className="modal_loading"></div>
//         break;
//     case 'LOADED':
//         pieChart =            
//             /*{ <Col xs={4} className='labels'>
//               <Row>
//                 <div className='box negative'/>
//                 <p> positive: {positive}% </p>
//               </Row>
//               <Row>
//                 <div className='box positive'/>
//                 <p> negative: {negative}% </p>
//               </Row>
//               <Row>
//                 <div className='box neutral'/>
//                 <p> neutral: {neutral}% </p>
//               </Row>
//             </Col>
//             <Col xs={8} className='pie'> }*/
//               <PieChart slices={[
//                   {
//                     color: '#fce176',
//                     value: this.props.neutral
//                   },
//                   {
//                     color: '#94fc9d',
//                     value: this.props.positive
//                   },
//                   {
//                     color: '#ed3b41',
//                     value: this.props.negative
//                   },
//                 ]}
//               />
//             {/* </Col> */}
//       break;
//     default:
//       pieChart = <b>Failed to load data, please try again</b>
//       break;
//   }

//   return (
//     <div className="container-fluid">
//       {pieChart}
//     </div>
//   );
// }