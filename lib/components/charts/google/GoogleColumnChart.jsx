"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = _interopRequire(require("react"));

var GoogleChart = _interopRequire(require("./GoogleChart"));

/**
 * Wrapper around google.visualization.ColumnChart
 * https://developers.google.com/chart/interactive/docs/gallery/columnchart
 */
var GoogleColumnChart = React.createClass({

  displayName: "GoogleColumnChart",

  getImageURI: function getImageURI() {
    return this.refs.chart.getImageURI();
  },

  /**
   * Returns the options to be passed to the child Chart
   * @return {Object}
   */
  _getOptions: function _getOptions() {
    return {
      legend: {
        position: "right",
        alignment: "center" },
      chartArea: {
        width: "60%",
        height: "80%" },
      fontSize: 14
    };
  },

  render: function render() {
    return React.createElement(GoogleChart, _extends({}, this.props, {
      ref: "chart",
      googleChart: google.visualization.ColumnChart,
      options: this._getOptions()
    }));
  }

});

module.exports = GoogleColumnChart;