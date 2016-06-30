import React, { PropTypes } from 'react';

import Positioned from './Positioned';
import Append from './Append';

const FollowCursor = React.createClass({

  displayName: 'FollowCursor',

  propTypes: {
    hasOverlay: PropTypes.bool.isRequired,
    renderOverlay: PropTypes.func.isRequired,
    children: PropTypes.node,
    style: PropTypes.object,
    appendTo: PropTypes.instanceOf(Node),
  },

  defaultProps: {
    appendTo: document.body,
  },

  getInitialState() {
    return {
      mousePosition: {top: -9999, left: -9999},
    };
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

  render() {
    const { hasOverlay, renderOverlay, children, style, appendTo, ...otherProps } = this.props;

    let overlay;
    if (hasOverlay) {
      overlay = (
        <Positioned
          key="__overlay"
          position={this.state.mousePosition}
          children={renderOverlay()}
        />
      );

      if (appendTo) {
        overlay = <Append to={appendTo}>{overlay}</Append>;
      }
    }

    return (
      <div {...otherProps} style={{...style, position: 'relative'}} onMouseMove={this._handleMouseMove}>
        {overlay}
        {children}
      </div>
    );
  },

});

export default FollowCursor;
