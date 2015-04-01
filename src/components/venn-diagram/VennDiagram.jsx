import React, {PropTypes} from 'react';
import _ from 'lodash';
import HoverTooltip from '../tooltip/HoverTooltip';
import TooltipData from '../tooltip/TooltipTable';
import VennCanvas from './VennCanvas';
import VennLegend from './VennLegend';
import VennData from '../../models/VennData';

import './VennDiagram.scss';

/**
 * Wrapper around the venn.js library
 */
const VennDiagram = React.createClass({

  displayName: 'VennDiagram',

  propTypes: {
    vennData: PropTypes.instanceOf(VennData).isRequired,
    setLabel: PropTypes.string,
    sizeLabel: PropTypes.string,
    formatSize: PropTypes.func,
    inclusive: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      setLabel: 'Set',
      sizeLabel: 'Size',
      formatSize: (v) => `${v}`,
      inclusive: false,
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
      <TooltipData
        groups={[
          [this.props.setLabel, this.state.activeSet.get('label')]
        ]}
        metrics={[
          [this.props.sizeLabel, this.props.formatSize(this.props.vennData.getSizeOf(this.state.activeSet, this.props.inclusive))]
        ]}
      />
    );
  },

});

export default VennDiagram;
