import React from 'react';
import '../styles/sentiment-pie.css';
import SentimentSlice from '../components/sentiment-slice';
import d3 from 'd3';

//This is the Presentation component
class SentimentPie extends React.Component {
  constructor(props) {
    super(props);
    this.colorScale = ['#2ecc71', '#e74c3c', '#e3c800'];
    this.renderSlice = this.renderSlice.bind(this);
  }

  render () {
    let {x, y, data} = this.props;
    let pie = d3.layout.pie();
    return (
      <g transform={`translate(${x}, ${y})`}>
        {pie(data).map(this.renderSlice)}
      </g>
    );
  }

  renderSlice(value, i) {
    let {innerRadius, outerRadius, cornerRadius, padAngle} = this.props;
    return (
      <SentimentSlice key={i}
                      innerRadius={innerRadius}
                      outerRadius={outerRadius}
                      cornerRadius={cornerRadius}
                      padAngle={padAngle}
                      value={value}
                      label={value.data}
                      fill={this.colorScale[i]} />
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