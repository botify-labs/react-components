import React, {PropTypes} from 'react';
import _ from 'lodash';
import HoverTooltip from '../tooltip/hover-tooltip';
import VennCanvas from './venn-canvas';
import VennLegend from './venn-legend';
import VennData from '../../models/VennData';

import './venn-diagram.scss';

/**
 * Wrapper around the venn.js library
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
    let {vennData, inclusive, onClick, ...otherProps} = this.props;
    return (
      <HoverTooltip
        hasTooltip={!!this.state.activeSet}
        renderTooltip={this._renderTooltip}
      >
        <div {...otherProps} className="VennChart">
          <VennCanvas
            ref="canvas"
            vennData={vennData}
            inclusive={inclusive}
            activeSet={this.state.activeSet}
            onClick={onClick}
            onMouseOver={this._handleMouseOver}
            onMouseOut={this._handleMouseOut}
          />
          <VennLegend
            vennData={vennData}
            onClick={onClick}
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
    return (
      <table className="Tooltip-data">
        <tbody className="Tooltip-groups">
          <tr>
            <td className="Tooltip-cell-label">Set</td>
            <td>{this.state.activeSet.get('label')}</td>
          </tr>
        </tbody>
        <tbody className="Tooltip-metrics">
          <tr>
            <td className="Tooltip-cell-label">Size</td>
            <td>{this.props.vennData.getSizeOf(this.state.activeSet, this.props.inclusive)}</td>
          </tr>
        </tbody>
      </table>
    );
  },

});

export default VennDiagram;
