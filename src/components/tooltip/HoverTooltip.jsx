import React, { PropTypes } from 'react/addons';

import Tooltip from './Tooltip';
import Append from './Append';

var HoverTooltip = React.createClass({

  displayName: 'HoverTooltip',

  propTypes: {
    hasTooltip: PropTypes.bool,
    renderTooltip: PropTypes.func.isRequired,
    children: PropTypes.node,
    style: PropTypes.object,
    appendTo: PropTypes.instanceOf(Node),
  },

  getInitialState() {
    return {
      mousePosition: {top: -9999, left: -9999},
    };
  },

  render() {
    let { hasTooltip, renderTooltip, children, style, appendTo, ...otherProps } = this.props;

    let tooltip;
    if (hasTooltip) {
      tooltip = (
        <Tooltip
          key="__tooltip"
          position={this.state.mousePosition}
          children={renderTooltip()}
        />
      );

      if (appendTo) {
        tooltip = <Append to={appendTo}>{tooltip}</Append>;
      }
    }

    return (
      <div {...otherProps} style={{...style, position: 'relative'}} onMouseMove={this._handleMouseMove}>
        {tooltip}
        {children}
      </div>
    );
  },

  _handleMouseMove(e) {
    // Keep track of the mouse position so that we can have the tooltip
    // follow the cursor
    this.setState({
      mousePosition: {
        top: e.pageY,
        left: e.pageX,
      },
    });
  },

});

export default HoverTooltip;
