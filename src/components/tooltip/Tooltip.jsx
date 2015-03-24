import React from 'react/addons';

import './Tooltip.scss';

var Tooltip = React.createClass({

  displayName: 'Tooltip',

  propTypes: {
    position: React.PropTypes.shape({
      top: React.PropTypes.number.isRequired,
      left: React.PropTypes.number.isRequired
    })
  },

  getInitialState() {
    return {
      width: null,
      height: null,
    };
  },

  componentDidMount() {
    var node = this.getDOMNode();

    this.setState({
      width: node.offsetWidth,
      height: node.offsetHeight,
    });
  },

  render() {
    var style;
    var {width, height} = this.state;
    if (width === null) {
      style = {position: 'absolute', top: -9999, left: -9999};
    } else {
      style = this._getStyle();
    }

    return (
      <div className="Tooltip" style={style}>
        {this.props.children}
      </div>
    );
  },

  _getStyle() {
    var style = {position: 'absolute'};
    var margin = 10; // x and y margin between the mouse and the tooltip
    var {position} = this.props;
    var {width, height} = this.state;
    var containerWidth = document.body.offsetWidth;

    // Calculate the best position for the tooltip so that
    //  * it won't overlay its given focus position
    //  * it won't cross its container's boundaries

    if (position.top - height - margin > 0) {
      style.top = position.top - height - margin;
    } else {
      style.top = position.top + margin;
    }

    if (position.left - width / 2 > 0 && position.left + width / 2 < containerWidth) {
      style.left = position.left - width / 2;
    } else if (position.left - width - margin > 0) {
      style.left = position.left - width - margin;
    } else {
      style.left = position.left + margin;
    }

    return style;
  }

});

export default Tooltip;
