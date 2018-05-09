import React from 'react';
import d3 from 'd3';

class SentimentSlice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isHovered: false};
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    onMouseOver() {
        this.setState({isHovered: true});
    }

    onMouseOut() {
        this.setState({isHovered: false});
    }

    render() {
        let {value, label, fill, innerRadius = 0, outerRadius, cornerRadius, padAngle, onChartClick} = this.props;
        if (this.state.isHovered) {
            outerRadius *= 1.1;
        }

        let arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .cornerRadius(cornerRadius)
            .padAngle(padAngle);

        return (
            <g onMouseOver={this.onMouseOver}
               onMouseOut={this.onMouseOut}
               >
                <path d={arc(value)} fill={fill} />
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
