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
        // console.log(this.state.isSelected);
    }

    onMouseOut() {
        this.setState({isHovered: false});
    }

    handleClick = polarity => {
      if(!this.state.isSelected){

        this.setState({isSelected: true});
        modelInstance.setChartTweets(polarity);

        // attach/remove event handler
        document.addEventListener('click', event => {
          // console.log(event.target)
          // if (event.target === 'svg') {
          //   return;
          // }
          modelInstance.setChartTweets('all');
          this.setState({isSelected: false});
        }, true);

      } else {
        this.setState({isSelected: false});

        document.removeEventListener('click', event => {
          this.setState({isSelected: true});
        }, true);

      }
    }

    render() {
        let {value, label, fill, innerRadius = 0, outerRadius, cornerRadius, padAngle, onChartClick, sentiment} = this.props;
        let polarity = '';
        if (this.state.isSelected) {
            outerRadius *= 1.1;
        }

        if(sentiment === 0){
          polarity = 'positive'
        }
        else if(sentiment === 1){
          polarity = 'negative'
        }

        let arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .cornerRadius(cornerRadius)
            .padAngle(padAngle);

        return (
            <g onMouseOver={this.onMouseOver}
               onMouseOut={this.onMouseOut}
               ref={node => { this.node = node;}}
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
