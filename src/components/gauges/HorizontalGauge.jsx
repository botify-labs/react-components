import React, { PropTypes } from 'react';

import HoverTooltip from '../tooltip/HoverTooltip';
import TooltipTable from '../tooltip/TooltipTable';
import './HorizontalGauge.scss';

let stackPropType = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.number,
  color: PropTypes.string
});

const HorizontalGauge = React.createClass({

  displayName: 'HorizontalGauge',

  propTypes: {
    /**
     * Stacks are filled areas of the gauge.
     * All is the background area of the gauge.
     * Example: [#######====     ]
     *  * ### is the first stack
     *  * === is the second stack
     *  * blank space is the `all` stack
     */
    all: stackPropType,
    stacks: PropTypes.arrayOf(stackPropType)
  },

  getInitialState() {
    return {
      hasTooltip: false,
    };
  },

  _handleMouseEnter() {
    this.setState({
      hasTooltip: true,
    });
  },

  _handleMouseLeave() {
    this.setState({
      hasTooltip: false,
    });
  },

  _renderTooltip() {
    let { stacks, all } = this.props;
    return (
      <TooltipTable
        groups={[[all.label, all.value]]}
        metrics={stacks.map((stack) => [stack.label, stack.value])}
      />
    );
  },

  render() {
    let { stacks, all } = this.props;
    let { hasTooltip } = this.state;
    return (
      <HoverTooltip
        hasTooltip={hasTooltip}
        renderTooltip={this._renderTooltip}
      >
        <div
          onMouseEnter={this._handleMouseEnter}
          onMouseLeave={this._handleMouseLeave}
          className="HorizontalGauge"
          style={{ backgroundColor: all.color }}
        >
          {stacks.map((stack) => (
            <div
              className="HorizontalGauge-stack"
              style={{
                width: `${stack.value / all.value * 100}%`,
                backgroundColor: stack.color,
              }}
            />
          ))}
        </div>
      </HoverTooltip>
    );

  }

});

export default HorizontalGauge;
