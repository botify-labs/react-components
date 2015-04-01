"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var React = _interopRequire(_react);

var PropTypes = _react.PropTypes;

var _ = _interopRequire(require("lodash"));

var HoverTooltip = _interopRequire(require("../tooltip/HoverTooltip"));

var TooltipData = _interopRequire(require("../tooltip/TooltipTable"));

var VennCanvas = _interopRequire(require("./VennCanvas"));

var VennLegend = _interopRequire(require("./VennLegend"));

var VennData = _interopRequire(require("../../models/VennData"));

require("./VennDiagram.scss");

/**
 * Wrapper around the venn.js library
 */
var VennDiagram = React.createClass({

  displayName: "VennDiagram",

  propTypes: {
    vennData: PropTypes.instanceOf(VennData).isRequired,
    setLabel: PropTypes.string,
    sizeLabel: PropTypes.string,
    formatSize: PropTypes.func,
    inclusive: PropTypes.bool },

  getDefaultProps: function getDefaultProps() {
    return {
      setLabel: "Set",
      sizeLabel: "Size",
      formatSize: function (v) {
        return "" + v;
      },
      inclusive: false };
  },

  getInitialState: function getInitialState() {
    return {
      activeSet: null
    };
  },

  render: function render() {
    var _props = this.props;
    var vennData = _props.vennData;
    var inclusive = _props.inclusive;
    var onClick = _props.onClick;

    var otherProps = _objectWithoutProperties(_props, ["vennData", "inclusive", "onClick"]);

    var activeSet = this.state.activeSet;

    return React.createElement(
      HoverTooltip,
      {
        hasTooltip: !!activeSet,
        renderTooltip: this._renderTooltip
      },
      React.createElement(
        "div",
        _extends({}, otherProps, { className: "VennChart" }),
        React.createElement(VennCanvas, {
          ref: "canvas",
          vennData: vennData,
          inclusive: inclusive,
          activeSet: activeSet,
          onClick: onClick,
          onMouseOver: this._handleMouseOver,
          onMouseOut: this._handleMouseOut
        }),
        React.createElement(VennLegend, {
          vennData: vennData,
          onClick: onClick,
          onMouseOver: this._handleMouseOver,
          onMouseOut: this._handleMouseOut
        })
      )
    );
  },

  _handleMouseOver: function _handleMouseOver(thing) {
    this.setState({ activeSet: thing });
  },

  _handleMouseOut: function _handleMouseOut(thing) {
    this.setState({ activeSet: null });
  },

  _renderTooltip: function _renderTooltip() {
    var _props = this.props;
    var setLabel = _props.setLabel;
    var sizeLabel = _props.sizeLabel;
    var formatSize = _props.formatSize;
    var vennData = _props.vennData;
    var inclusive = _props.inclusive;
    var activeSet = this.state.activeSet;

    return React.createElement(TooltipData, {
      groups: [[setLabel, activeSet.get("label")]],
      metrics: [[sizeLabel, formatSize(vennData.getSizeOf(activeSet, inclusive))]]
    });
  } });

module.exports = VennDiagram;