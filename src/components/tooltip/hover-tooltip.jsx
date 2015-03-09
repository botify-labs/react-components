import React from 'react/addons';
import {Map} from 'immutable';

import Tooltip from './tooltip';

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
    return (
      <div onMouseMove={this._handleMouseMove}>
        {this.props.hasTooltip &&
          <Tooltip
            key="__tooltip"
            position={this.state.mousePosition}
            children={this.props.renderTooltip()}
          />
        }
        {this.props.children}
      </div>
    );
  },

  _handleMouseMove(e) {
    let rect = this.getDOMNode().getBoundingClientRect();
    // Keep track of the mouse position so that we can have the tooltip
    // follow the cursor
    this.setState({
      mousePosition: {
        // TODO: replace this with actual values
        top: e.pageY - rect.top,
        left: e.pageX - rect.left,
      }
    });
  },

});

export default HoverTooltip;
