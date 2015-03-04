import React, {PropTypes} from 'react';
import _ from 'lodash';
import HoverTooltip from '../tooltip/hover-tooltip';
import VennCanvas from './venn-canvas';
import VennLegend from './venn-legend';
import VennData from '../../models/VennData';

import './venn-diagram.scss';

/**
 * Wrapper around the venn d3 library
 */
const VennDiagram = React.createClass({

  displayName: 'VennDiagram',

  propTypes: {
    vennData: PropTypes.instanceOf(VennData).isRequired,
    inclusive: PropTypes.bool
  },

  getDefaultProps() {
    return {
      inclusive: false
    };
  },

  getInitialState() {
    return {
      activeSet: null
    };
  },

  render() {
    return (
      <HoverTooltip
        hasTooltip={!!this.state.activeSet}
        renderTooltip={this._renderTooltip}
      >
        <div className="VennChart" style={{height: 500}}>
          <VennCanvas
            ref="canvas"
            vennData={this.props.vennData}
            activeSet={this.state.activeSet}
            onMouseOver={this._handleMouseOver}
            onMouseOut={this._handleMouseOut}
          />
          <VennLegend
            vennData={this.props.vennData}
            onMouseOver={this._handleMouseOver}
            onMouseOut={this._handleMouseOut}
          />
        </div>
      </HoverTooltip>
    );
  },

  _handleMouseOver(thing) {
    this.setState({activeSet: thing});
  },

  _handleMouseOut(thing) {
    this.setState({activeSet: null});
  },

  _renderTooltip() {
    let {inclusive} = this.props;

    return (
      <div>
        <div>{this.state.activeSet.get(inclusive ? 'inclusiveLabel' : 'exclusiveLabel')}</div>
        <div>Size: {this.props.vennData.getSizeOf(this.state.activeSet, inclusive)}</div>
      </div>
    );
  },

});

export default VennDiagram;
