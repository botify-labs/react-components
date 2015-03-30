import React from 'react/addons';

import Tooltip from './Tooltip';

var HoverTooltip = React.createClass({

  displayName: 'HoverTooltip',

  propTypes: {
    hasTooltip: React.PropTypes.bool,
    renderTooltip: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      mousePosition: {top: -9999, left: -9999}
    };
  },

  render() {
    let { hasTooltip, renderTooltip, children, style, ...otherProps } = this.props;

    return (
      <div {...otherProps} style={{...style, position: 'relative'}} onMouseMove={this._handleMouseMove}>
        {hasTooltip &&
          <Tooltip
            key="__tooltip"
            position={this.state.mousePosition}
            children={renderTooltip()}
          />
        }
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
        left: e.pageX
      }
    });
  },

});

export default HoverTooltip;
