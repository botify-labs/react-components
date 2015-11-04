import React, { PropTypes } from 'react';
import classNames from 'classnames';

import FollowCursor from '../misc/FollowCursor';
import Tooltip from '../tooltip/Tooltip';
import TooltipTable from '../tooltip/TooltipTable';

const stackPropType = PropTypes.shape({
  value: PropTypes.number.isRequired,
  label: PropTypes.string,
  color: PropTypes.string,
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
    all: stackPropType.isRequired,
    stacks: PropTypes.arrayOf(stackPropType).isRequired,
    formatAllValue: PropTypes.func,
    formatStackValue: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
    renderTooltip: PropTypes.func,
  },

  getDefaultProps() {
    return {
      formatAllValue: v => `${v}`,
      formatStackValue: v => `${v}`,
    };
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

  render() {
    const { stacks, all, style, renderTooltip, className, ...otherProps } = this.props;
    const { hasTooltip } = this.state;

    return (
      <FollowCursor
        hasOverlay={hasTooltip}
        renderOverlay={renderTooltip || this._renderTooltip}
      >
        <div
          {...otherProps}
          onMouseEnter={this._handleMouseEnter}
          onMouseLeave={this._handleMouseLeave}
          className={classNames('HorizontalGauge', className)}
          style={{ position: 'relative', ...style }}
        >
          <div className="HorizontalGauge-stacks">
            <div
              className="HorizontalGauge-all"
              style={{
                position: 'absolute',
                width: '100%',
                backgroundColor: all.color,
              }}
            />
            {stacks.map((stack, idx) => (
              <div
                key={idx}
                className="HorizontalGauge-stack"
                style={{
                  position: 'relative',
                  width: `${stack.value / all.value * 100}%`,
                  backgroundColor: stack.color,
                }}
              />
            ))}
          </div>
        </div>
      </FollowCursor>
    );
  },

  _renderTooltip() {
    const { stacks, all, formatAllValue, formatStackValue } = this.props;
    return (
      <Tooltip className="HorizontalGauge-tooltip">
        <TooltipTable
          groups={[[all.label, formatAllValue(all.value)]]}
          metrics={stacks.map((stack) => [stack.label, formatStackValue(stack.value)])}
        />
      </Tooltip>
    );
  },

});

export default HorizontalGauge;
