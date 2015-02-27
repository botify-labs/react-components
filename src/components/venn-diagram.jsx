import React from 'react';
import Immutable from 'immutable';
import d3 from 'd3';

// venn sets itself on the window object and expects d3 to be globally set as well
// below is a shim that fixes this
import venn from 'imports?d3=d3,window=>{}!exports?window.venn!venn';

import HoverTooltip from './tooltip/hover-tooltip';

/**
 * Wrapper around the venn d3 library
 */
var VennDiagram = React.createClass({

  displayName: 'VennDiagram',

  getInitialState() {
    return {
      hoveredData: null,
      width: null
    };
  },

  componentDidMount() {
    this.setState({
      width: this.getDOMNode().offsetWidth
    });
  },

  render() {
    if (this.state.width === null) {
      return <div></div>;
    }

    var width = this.state.width;
    var height = 400;
    var padding = 10;

    var colours = d3.scale.category10();

    // get positions for each set
    var circles = venn.venn(this.props.sets, this.props.intersections);
    circles = venn.scaleSolution(circles, this.state.width, height, padding);

    var circleElements = circles.map((set, idx) => {
      var style = {
        stroke: set === this.state.hoveredData ? 'black' : null
      };

      return (
        <circle
          key={`circle${idx}`}
          onMouseOver={this._handleMouseOver.bind(null, set)}
          onMouseOut={this._handleMouseOut.bind(null, set)}
          r={set.radius}
          cx={set.x}
          cy={set.y}
          fill={colours(idx)}
          style={style}
          opacity="0.5"
        />
      );
    });

    var intersectionElements = this.props.intersections.map((intersection, idx) => {
      var sets = intersection.sets;
      var combination = [circles[sets[0]], circles[sets[1]]];
      var style = {
        stroke: intersection === this.state.hoveredData ? 'black' : null
      };

      return (
        <path
          key={`intersection${idx}`}
          onMouseOver={this._handleMouseOver.bind(null, intersection)}
          onMouseOut={this._handleMouseOut.bind(null, intersection)}
          style={style}
          d={venn.intersectionAreaPath(combination) + 'Z'}
          fill="transparent"
        />
      );
    });

    return (
      <HoverTooltip
        hasTooltip={!!this.state.hoveredData}
        renderTooltip={this._renderTooltip}
      >
        <svg width={width} height={height} ref="svg">
          {circleElements}
          {intersectionElements}
        </svg>
      </HoverTooltip>
    );
  },

  _handleMouseOver(thing) {
    this.setState({hoveredData: thing});
  },

  _handleMouseOut(thing) {
    this.setState({hoveredData: null});
  },

  _renderTooltip() {
    return (
      <div>
        <div>{this.state.hoveredData.metadata.label}</div>
        <div>Size: {this.state.hoveredData.size}</div>
      </div>
    );
  },

});

export default VennDiagram;