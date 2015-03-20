"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react/addons"));

require("./TooltipTable.scss");

/**
 * Renders a 2xN table from its props
 * Primary purpose is to represent chart data in tooltips
 */
var TooltipTable = React.createClass({

  displayName: "TooltipTable",

  propTypes: {
    // Data rows are separated in two categories: groups and metrics.
    // Their format is the same, they only differ in style.
    groups: React.PropTypes.arrayOf(React.PropTypes.array), // [[label, value], ...]
    metrics: React.PropTypes.arrayOf(React.PropTypes.array)
  },

  _renderRow: function _renderRow(row, idx) {
    return React.createElement(
      "tr",
      { key: idx, className: "TooltipTable-cell" },
      React.createElement(
        "td",
        { className: "TooltipTable-cell-label" },
        row[0]
      ),
      React.createElement(
        "td",
        { className: "TooltipTable-cell-value" },
        row[1]
      )
    );
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "TooltipTable" },
      React.createElement(
        "table",
        null,
        React.createElement(
          "tbody",
          { className: "TooltipTable-groups" },
          this.props.groups && this.props.groups.map(this._renderRow)
        ),
        React.createElement(
          "tbody",
          { className: "TooltipTable-metrics" },
          this.props.metrics && this.props.metrics.map(this._renderRow)
        )
      )
    );
  } });

module.exports = TooltipTable;