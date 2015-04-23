import React, {PropTypes} from 'react';
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
    onClick: PropTypes.func,
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
      activeSet: null,
    };
  },

  render() {
    let {vennData, inclusive, onClick, ...otherProps} = this.props;
    let {activeSet} = this.state;
    return (
      <HoverTooltip
        hasTooltip={!!activeSet}
        renderTooltip={this._renderTooltip}
      >
        <div {...otherProps} className="VennChart">
          <VennCanvas
            ref="canvas"
            vennData={vennData}
            inclusive={inclusive}
            activeSet={activeSet}
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
    let {setLabel, sizeLabel, formatSize, vennData, inclusive} = this.props;
    let {activeSet} = this.state;
    return (
      <TooltipData
        groups={[
          [setLabel, activeSet.get('label')],
        ]}
        metrics={[
          [sizeLabel, formatSize(vennData.getSizeOf(activeSet, inclusive))],
        ]}
      />
    );
  },

});

export default VennDiagram;
