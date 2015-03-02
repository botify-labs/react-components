import React from 'react';
import Immutable from 'immutable';

// venn sets itself on the window object and expects d3 to be globally set as well
// below is a shim that fixes this
import venn from 'imports?window=>{}!exports?window.venn!venn';

import HoverTooltip from './tooltip/hover-tooltip';

import './venn-diagram.scss';

var VennLegend = React.createClass({

  render() {
    var sets = this.props.sets.map((set, idx) => {
      return (
        <li
          key={`set${idx}`}
          onMouseOver={this.props.onMouseOver && this.props.onMouseOver.bind(null, set)}
          onMouseOut={this.props.onMouseOut && this.props.onMouseOut.bind(null, set)}
        >
          <div
            className="VennLegend-square"
            style={{backgroundColor: set.metadata.color}}
          />
          {set.metadata.label}
        </li>
      );
    });

    var intersections = this.props.intersections.map((intersection, idx) => {
      return (
        <li
          key={`intersection${idx}`}
          onMouseOver={this.props.onMouseOver && this.props.onMouseOver.bind(null, intersection)}
          onMouseOut={this.props.onMouseOut && this.props.onMouseOut.bind(null, intersection)}
        >
          <div
            className="VennLegend-square"
            style={{backgroundColor: intersection.metadata.color}}
          />
          {intersection.metadata.label}
        </li>
      );
    });

    return (
      <ul className="VennLegend">
        {sets}
        {intersections}
      </ul>
    );
  }

});

var VennCircles = React.createClass({

  displayName: 'VennCircles',

  componentDidMount() {
    this._scale();

    window.addEventListener('resize', this._scale);
  },

  getInitialState() {
    return {
      width: 1000,
      height: 1000
    };
  },

  _scale() {
    this.setState({
      width: this.getDOMNode().offsetWidth,
      height: this.getDOMNode().offsetHeight
    });
  },

  render() {
    var padding = 10;

    // get positions for each set
    var circles = venn.venn(this.props.sets, this.props.intersections);
    circles = venn.scaleSolution(circles, this.state.width, this.state.height, padding);

    var circleElements = circles.map((set, idx) => {
      var stroke, strokeWidth;
      if (set === this.props.activeElement) {
        stroke = 'black';
        strokeWidth = 5;
      }

      return (
        <circle
          key={`circle${idx}`}
          onMouseOver={this._handleMouseOver.bind(null, set)}
          onMouseOut={this._handleMouseOut.bind(null, set)}
          r={set.radius}
          cx={set.x}
          cy={set.y}
          fill={set.metadata.color}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    });

    var intersectionElements = this.props.intersections.map((intersection, idx) => {
      var sets = intersection.sets;
      var combination = [circles[sets[0]], circles[sets[1]]];
      var stroke, strokeWidth;
      if (intersection === this.props.activeElement) {
        stroke = 'black';
        strokeWidth = 5;
      }

      return (
        <path
          key={`intersection${idx}`}
          onMouseOver={this._handleMouseOver.bind(null, intersection)}
          onMouseOut={this._handleMouseOut.bind(null, intersection)}
          stroke={stroke}
          strokeWidth={strokeWidth}
          d={venn.intersectionAreaPath(combination) + 'Z'}
          fill={intersection.metadata.color}
        />
      );
    });

    return (
      <svg
        className="VennCircles"
        width={this.props.width}
        height={this.props.height}
      >
        {circleElements}
        {intersectionElements}
      </svg>
    );
  },

  _handleMouseOver(thing) {
    if (this.props.onMouseOver) {
      this.props.onMouseOver(thing);
    }
  },

  _handleMouseOut(thing) {
    if (this.props.onMouseOut) {
      this.props.onMouseOut(thing);
    }
  }

})

/**
 * Wrapper around the venn d3 library
 */
var VennDiagram = React.createClass({

  displayName: 'VennDiagram',

  getInitialState() {
    return {
      activeElement: null,
      width: null
    };
  },

  render() {
    return (
      <HoverTooltip
        hasTooltip={!!this.state.activeElement}
        renderTooltip={this._renderTooltip}
      >
        <div className="VennChart" style={{height: 500}}>
          <VennCircles
            ref="canvas"
            sets={this.props.sets}
            intersections={this.props.intersections}
            activeElement={this.state.activeElement}
            onMouseOver={this._handleMouseOver}
            onMouseOut={this._handleMouseOut}
          />
          <VennLegend
            sets={this.props.sets}
            intersections={this.props.intersections}
            onMouseOver={this._handleMouseOver}
            onMouseOut={this._handleMouseOut}
          />
        </div>
      </HoverTooltip>
    );
  },

  _handleMouseOver(thing) {
    this.setState({activeElement: thing});
  },

  _handleMouseOut(thing) {
    this.setState({activeElement: null});
  },

  _renderTooltip() {
    return (
      <div>
        <div>{this.state.activeElement.metadata.label}</div>
        <div>Size: {this.state.activeElement.size}</div>
      </div>
    );
  },

});

export default VennDiagram;