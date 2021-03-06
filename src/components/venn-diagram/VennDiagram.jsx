import React, {PropTypes} from 'react';
import FollowCursor from '../misc/FollowCursor';
import Tooltip from '../tooltip/Tooltip';
import TooltipTable from '../tooltip/TooltipTable';
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

  _handleMouseOver(thing) {
    this.setState({activeSet: thing});
  },

  _handleMouseOut(thing) {
    this.setState({activeSet: null});
  },

  render() {
    const {vennData, inclusive, onClick, ...otherProps} = this.props;
    const {activeSet} = this.state;
    return (
      <FollowCursor
        hasOverlay={!!activeSet}
        renderOverlay={this._renderTooltip}
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
      </FollowCursor>
    );
  },

  _renderTooltip() {
    const {setLabel, sizeLabel, formatSize, vennData, inclusive} = this.props;
    const {activeSet} = this.state;
    return (
      <Tooltip className="VennChart-tooltip">
        <TooltipTable
          groups={[
            [setLabel, activeSet.get('label')],
          ]}
          metrics={[
            [sizeLabel, formatSize(vennData.getSizeOf(activeSet, inclusive))],
          ]}
        />
      </Tooltip>
    );
  },

});

export default VennDiagram;
