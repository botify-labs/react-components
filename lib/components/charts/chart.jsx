"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = _interopRequire(require("react/addons"));

var HoverTooltip = _interopRequire(require("../tooltip/HoverTooltip"));

var TooltipTable = _interopRequire(require("../tooltip/TooltipTable"));

var Chart = React.createClass({

  displayName: "Chart",

  getInitialState: function getInitialState() {
    return {
      hoveredData: null
    };
  },

  getImageURI: function getImageURI() {
    return this.refs.chart.getImageURI();
  },

  render: function render() {
    return React.createElement(
      HoverTooltip,
      {
        hasTooltip: !!this.state.hoveredData,
        renderTooltip: this._renderTooltip
      },
      React.createElement(this.props.chart, _extends({}, this.props, {
        key: "chart",
        ref: "chart",
        onChartMouseOver: this._handleChartMouseOver,
        onChartMouseOut: this._handleChartMouseOut,
        onMouseMove: this._updateMousePosition
      }))
    );
  },

  _renderTooltip: function _renderTooltip() {
    var _this = this;

    var data = this.state.hoveredData.entrySeq().map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var dataKeys = _ref2[0];
      var dataValues = _ref2[1];

      var groups = dataKeys.entrySeq().map(function (_ref3, idx) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var dimKey = _ref32[0];
        var groupKey = _ref32[1];

        var dimension = _this.props.chartData.getDimension(dimKey);
        var group = _this.props.chartData.getDimensionGroup(dimKey, groupKey);
        return [dimension.get("label"), group.get("label")];
      });

      var metrics = dataValues.map(function (value, idx) {
        var metric = _this.props.chartData.getMetric(idx);
        return [metric.get("label"), metric.get("render")(value)];
      });

      return React.createElement(TooltipTable, { groups: groups.toJS(), metrics: metrics.toJS() });
    });

    return React.createElement(
      "div",
      { className: "Chart-tooltip" },
      data.toJS()
    );
  },

  _handleChartMouseOver: function _handleChartMouseOver(data) {
    // Show the tooltip when a chart element is hovered
    this.setState({ hoveredData: data });
  },

  _handleChartMouseOut: function _handleChartMouseOut() {
    // Hide the tooltip when a chart element stops being hovered
    this.setState({ hoveredData: null });
  }

});

module.exports = Chart;