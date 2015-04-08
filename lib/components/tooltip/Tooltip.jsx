"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = _interopRequire(require("react/addons"));

var Tooltip = React.createClass({

  displayName: "Tooltip",

  propTypes: {
    position: React.PropTypes.shape({
      top: React.PropTypes.number.isRequired,
      left: React.PropTypes.number.isRequired
    }),
    margin: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      margin: 10 };
  },

  getInitialState: function getInitialState() {
    return {
      width: null,
      height: null };
  },

  componentDidMount: function componentDidMount() {
    var node = React.findDOMNode(this);

    this.setState({
      width: node.offsetWidth,
      height: node.offsetHeight });
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var node = React.findDOMNode(this);
    var width = node.offsetWidth;
    var height = node.offsetHeight;

    if (width !== prevState.width || height !== prevState.height) {
      this.setState({
        width: node.offsetWidth,
        height: node.offsetHeight });
    }
  },

  render: function render() {
    var _props = this.props;
    var style = _props.style;
    var children = _props.children;

    var otherProps = _objectWithoutProperties(_props, ["style", "children"]);

    style = _extends({}, this._getCommonStyle(), this._getPositionStyle(), style);

    return React.createElement(
      "div",
      _extends({}, otherProps, { className: "Tooltip", style: style }),
      children
    );
  },

  _getCommonStyle: function _getCommonStyle() {
    return { position: "fixed", pointerEvents: "none" };
  },

  _getPositionStyle: function _getPositionStyle() {
    var _state = this.state;
    var width = _state.width;
    var height = _state.height;

    if (width === null) {
      // The tooltip hasn't rendered yet
      return { top: -9999, left: -9999 };
    }

    var positionStyle = {};
    var _props = this.props;
    var position = _props.position;
    var margin = _props.margin;

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
  }

});

module.exports = Tooltip;
// x and y margin between the mouse and the tooltip