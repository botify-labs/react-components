import React, { PropTypes } from 'react/addons';

var Tooltip = React.createClass({

  displayName: 'Tooltip',

  propTypes: {
    position: React.PropTypes.shape({
      top: React.PropTypes.number.isRequired,
      left: React.PropTypes.number.isRequired,
    }),
    margin: React.PropTypes.number,
    children: PropTypes.node,
    style: PropTypes.object,
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

    if (width !== prevState.width || height !== prevState.height) {
      this.setState({
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    }
  },

  render() {
    let { style, children, ...otherProps } = this.props;
    style = { ...this._getCommonStyle(), ...this._getPositionStyle(), ...style };

    return (
      <div {...otherProps} className="Tooltip" style={style}>
        {children}
      </div>
    );
  },

  _getCommonStyle() {
    return { position: 'fixed', pointerEvents: 'none' };
  },

  _getPositionStyle() {
    var { width, height } = this.state;
    if (width === null) {
      // The tooltip hasn't rendered yet
      return { top: -9999, left: -9999 };
    }

    var positionStyle = {};
    var { position, margin } = this.props;
    var containerWidth = document.body.offsetWidth;

    // Calculate the best position for the tooltip so that
    //  * it won't overlay its given focus position
    //  * it won't cross its container's boundaries

    if (position.top - height - margin > 0) {
      positionStyle.top = position.top - height - margin;
    } else {
      positionStyle.top = position.top + margin;
    }

    if (position.left - width / 2 > 0 && position.left + width / 2 < containerWidth) {
      positionStyle.left = position.left - width / 2;
    } else if (position.left - width - margin > 0) {
      positionStyle.left = position.left - width - margin;
    } else {
      positionStyle.left = position.left + margin;
    }

    return positionStyle;
  },

});

export default Tooltip;
