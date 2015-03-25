import React from 'react/addons';

import './Tooltip.scss';

var Tooltip = React.createClass({

  displayName: 'Tooltip',

  propTypes: {
    position: React.PropTypes.shape({
      top: React.PropTypes.number.isRequired,
      left: React.PropTypes.number.isRequired
    }),
    margin: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      margin: 10, // x and y margin between the mouse and the tooltip
    };
  },

  getInitialState() {
    return {
      width: null,
      height: null,
    };
  },

  componentDidMount() {
    var node = React.findDOMNode(this);

    this.setState({
      width: node.offsetWidth,
      height: node.offsetHeight,
    });
  },

  componentDidUpdate(prevProps, prevState) {
    var node = React.findDOMNode(this);
    let width = node.offsetWidth;
    let height = node.offsetHeight;

    if (width != prevState.width || height != prevState.height) {
      this.setState({
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    }
  },

  render() {
    let { style, children, ...otherProps } = this.props;
    let { width, height } = this.state;
    if (width === null) {
      style = { ...style, position: 'fixed', top: -9999, left: -9999 };
    } else {
      style = { ...style, ...this._getStyle() };
    }

    return (
      <div {...otherProps} className="Tooltip" style={style}>
        {children}
      </div>
    );
  },

  _getStyle() {
    var style = { position: 'fixed' };
    var { position, margin } = this.props;
    var { width, height } = this.state;
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
