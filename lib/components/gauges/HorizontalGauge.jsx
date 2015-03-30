"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var React = _interopRequire(_react);

var PropTypes = _react.PropTypes;

var HoverTooltip = _interopRequire(require("../tooltip/HoverTooltip"));

var TooltipTable = _interopRequire(require("../tooltip/TooltipTable"));

require("./HorizontalGauge.scss");

var stackPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
});

var HorizontalGauge = React.createClass({

  displayName: "HorizontalGauge",

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
    stacks: PropTypes.arrayOf(stackPropType).isRequired
  },

  getInitialState: function getInitialState() {
    return {
      hasTooltip: false };
  },

  _handleMouseEnter: function _handleMouseEnter() {
    this.setState({
      hasTooltip: true });
  },

  _handleMouseLeave: function _handleMouseLeave() {
    this.setState({
      hasTooltip: false });
  },

  _renderTooltip: function _renderTooltip() {
    var _props = this.props;
    var stacks = _props.stacks;
    var all = _props.all;

    return React.createElement(TooltipTable, {
      groups: [[all.label, all.value]],
      metrics: stacks.map(function (stack) {
        return [stack.label, stack.value];
      })
    });
  },

  render: function render() {
    var _props = this.props;
    var stacks = _props.stacks;
    var all = _props.all;
    var style = _props.style;

    var otherProps = _objectWithoutProperties(_props, ["stacks", "all", "style"]);

    var hasTooltip = this.state.hasTooltip;

    return React.createElement(
      HoverTooltip,
      {
        hasTooltip: hasTooltip,
        renderTooltip: this._renderTooltip
      },
      React.createElement(
        "div",
        _extends({}, otherProps, {
          onMouseEnter: this._handleMouseEnter,
          onMouseLeave: this._handleMouseLeave,
          className: "HorizontalGauge",
          style: _extends({}, style, { backgroundColor: all.color })
        }),
        stacks.map(function (stack, idx) {
          return React.createElement("div", {
            key: idx,
            className: "HorizontalGauge-stack",
            style: {
              width: "" + stack.value / all.value * 100 + "%",
              backgroundColor: stack.color }
          });
        })
      )
    );
  }

});

module.exports = HorizontalGauge;