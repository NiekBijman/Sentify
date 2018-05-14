import React from 'react';
import d3 from 'd3';
import { modelInstance } from '../model/model';


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
      var chartContainer = document.querySelector("div.col-sm-4.col-md-4.col-xs-12.sentiment-pie");
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
        let {value, label, fill, innerRadius = 0, outerRadius, cornerRadius, padAngle, onChartClick, sentiment} = this.props;
        let polarity = '';
        if (this.state.isSelected) {
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

        return (
            <g onMouseOver={this.onMouseOver}
               onMouseOut={this.onMouseOut}
               className='pieSlice'

               >
                <path onClick={() => {this.handleClick(polarity)}}  d={arc(value)} fill={fill} /> {/*,*/}
                <text transform={`translate(${arc.centroid(value)})`}
                    dy=".35em"
                    textAnchor="middle"
                    fill="white">
                {label}
                </text>
            </g>
        );
    }
}

export default SentimentSlice;
