import React from 'react';
import d3 from 'd3';
import { modelInstance } from '../model/model';
import Tooltip from 'material-ui/Tooltip';

class SentimentSlice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isHovered: false,
          isSelected: false,
        };
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    onMouseOver() {
        this.setState({isHovered: true});
    }

    onMouseOut() {
        this.setState({isHovered: false});
    }

    handleClick = polarity => {
      var chartContainer = document.querySelector("#pie-chart");
      if(!this.state.isSelected){
        this.setState({isSelected: true});
        modelInstance.setChartTweets(polarity);

        // attach event handler
        chartContainer.addEventListener('click', this.handleOutsideClick, false);

      } else {
        this.setState({isSelected: false});
        //remove event handler
        chartContainer.removeEventListener('click', this.handleOutsideClick, false);
      }
    }

    handleOutsideClick = () => {
      // We want the chart to display all tweets again when the user clicks outside of the chart (in sentiment-pie div)
      modelInstance.setChartTweets('All');
      this.setState({isSelected: false});
    }

    render() {
        let {value, label, fill, innerRadius = 0, outerRadius, cornerRadius, padAngle, sentiment} = this.props;
        let polarity = '';
        let percentage, chartFill, tooltipText = null;
        if (this.state.isSelected && (this.props.status !== 'NULL')) {
            outerRadius *= 1.1;
        }
        if (this.state.isHovered) {
          if(!this.state.isSelected){
            outerRadius *= 1.05;
          }
        }

        if(sentiment === 0){
          polarity = 'Positive'
        }
        else if(sentiment === 1){
          polarity = 'Negative'
        }

        let arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .cornerRadius(cornerRadius)
            .padAngle(padAngle);

      switch (this.props.status) {
        case 'NULL' :
          chartFill ="url(#GraphGradient)"
          percentage = null;
          tooltipText = "Sentiment Chart"
          break;
        case 'LOADED':
          chartFill = fill
          percentage = label;
          tooltipText = polarity + " tweets"
          break;
        default:
          break;
        }

        return (
          <Tooltip open={!this.state.isSelected && this.state.isHovered} id="tooltip-icon" title={tooltipText} placement="right">
            <g onMouseOver={this.onMouseOver}
               onMouseOut={this.onMouseOut}
               className='pieSlice'

               >
                <path onClick={() => {this.handleClick(polarity)}}  d={arc(value)} fill={chartFill} /> {/* */}
                <text transform={`translate(${arc.centroid(value)})`}
                    dy=".35em"
                    textAnchor="middle"
                    fill="white">
                {percentage}
                </text>
            </g>
          </Tooltip>
        );
    }
}

export default SentimentSlice;
