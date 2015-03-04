import React from 'react';
import _ from 'lodash';
import HoverTooltip from '../tooltip/hover-tooltip';
import VennCanvas from './venn-canvas';
import VennLegend from './venn-legend';

import './venn-diagram.scss';

/**
 * Wrapper around the venn d3 library
 */
const VennDiagram = React.createClass({

  displayName: 'VennDiagram',

  propTypes: {
    sets: React.PropTypes.array,
    intersections: React.PropTypes.array,
    exclusives: React.PropTypes.array,
  },

  getInitialState() {
    return {
      activeElement: null
    };
  },

  render() {
    return (
      <HoverTooltip
        hasTooltip={!!this.state.activeElement}
        renderTooltip={this._renderTooltip}
      >
        <div className="VennChart" style={{height: 500}}>
          <VennCanvas
            ref="canvas"
            sets={this.props.sets}
            intersections={this.props.intersections}
            exclusives={this.props.exclusives}
            activeElement={this.state.activeElement}
            onMouseOver={this._handleMouseOver}
            onMouseOut={this._handleMouseOut}
          />
          <VennLegend
            sets={this.props.sets}
            intersections={this.props.intersections}
            exclusives={this.props.exclusives}
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
