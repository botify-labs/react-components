"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = _interopRequire(require("react/addons"));

var Map = require("immutable").Map;

var Tooltip = _interopRequire(require("./tooltip"));

var HoverTooltip = React.createClass({

  displayName: "HoverTooltip",

  propTypes: {
    hasTooltip: React.PropTypes.bool,
    renderTooltip: React.PropTypes.func.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      mousePosition: { top: -9999, left: -9999 }
    };
  },

  render: function render() {
    var _props = this.props;
    var hasTooltip = _props.hasTooltip;
    var renderTooltip = _props.renderTooltip;
    var children = _props.children;

    var otherProps = _objectWithoutProperties(_props, ["hasTooltip", "renderTooltip", "children"]);

    return React.createElement(
      "div",
      _extends({}, otherProps, { onMouseMove: this._handleMouseMove }),
      hasTooltip && React.createElement(Tooltip, {
        key: "__tooltip",
        position: this.state.mousePosition,
        children: renderTooltip()
      }),
      children
    );
  },

  _handleMouseMove: function _handleMouseMove(e) {
    var rect = this.getDOMNode().getBoundingClientRect();
    // Keep track of the mouse position so that we can have the tooltip
    // follow the cursor
    this.setState({
      mousePosition: {
        // TODO: replace this with actual values
        top: e.pageY - rect.top,
        left: e.pageX - rect.left }
    });
  } });

module.exports = HoverTooltip;