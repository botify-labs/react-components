"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react/addons"));

var Panel = _interopRequire(require("./components/panel/panel"));

var Table = _interopRequire(require("./components/table"));

var Chart = _interopRequire(require("./components/charts/chart"));

var GoogleColumnChart = _interopRequire(require("./components/charts/google/google-column-chart"));

var VennDiagram = _interopRequire(require("./components/venn-diagram/venn-diagram"));

var ChartData = _interopRequire(require("./models/ChartData"));

var VennData = _interopRequire(require("./models/VennData"));

var Immutable = _interopRequire(require("immutable"));

var Color = _interopRequire(require("color"));

var COLORS = {}; //#lol

var chartData = new ChartData();

chartData.addMetric(Immutable.Map({
  label: "Count",
  render: function (v) {
    return v;
  }
}));

chartData.addDimension("delay", Immutable.Map({
  label: "Delay"
}));
chartData.addDimensionGroup("delay", "fast", Immutable.Map({ label: "Fast (<500 ms)", color: COLORS.GOOD }));
chartData.addDimensionGroup("delay", "medium", Immutable.Map({ label: "Medium (500 ms < 1 s)", color: COLORS.MEDIUM }));
chartData.addDimensionGroup("delay", "slow", Immutable.Map({ label: "Slow (1 s < 2 s)", color: COLORS.BAD }));
chartData.addDimensionGroup("delay", "slowest", Immutable.Map({ label: "Slowest (>2 s)", color: COLORS.VERY_BAD }));

chartData.addDimension("content_type", Immutable.Map({
  label: "Content Type"
}));
chartData.addDimensionGroup("content_type", "text_html", Immutable.Map({ color: COLORS.GOOD, label: "text/html" }));
chartData.addDimensionGroup("content_type", "image_jpeg", Immutable.Map({ color: COLORS.YELLOW, label: "image/jpeg" }));
chartData.addDimensionGroup("content_type", "image_png", Immutable.Map({ color: COLORS.YELLOW, label: "image/png" }));
chartData.addDimensionGroup("content_type", "image_gif", Immutable.Map({ color: COLORS.YELLOW, label: "image/gif" }));
chartData.addDimensionGroup("content_type", "text_css", Immutable.Map({ color: COLORS.ORANGE1, label: "text/css" }));
chartData.addDimensionGroup("content_type", "javascript", Immutable.Map({ color: COLORS.ORANGE1, label: "javascript" }));
chartData.addDimensionGroup("content_type", "not_set", Immutable.Map({ label: "Not Set", color: COLORS.VERY_BAD }));

chartData.setData(Immutable.Map({
  delay: "fast",
  content_type: "text_html"
}), Immutable.List([1]));
chartData.setData(Immutable.Map({
  delay: "medium",
  content_type: "text_html"
}), Immutable.List([3]));
chartData.setData(Immutable.Map({
  delay: "medium",
  content_type: "text_css"
}), Immutable.List([4]));
chartData.setData(Immutable.Map({
  delay: "slowest",
  content_type: "javascript"
}), Immutable.List([4]));

var newUrls = 100;
var disappearedUrls = 50;
var allUrls = 150;

var currentUrls = allUrls;
var previousUrls = disappearedUrls + (allUrls - newUrls);
var commonUrls = allUrls - newUrls;

var vennData = new VennData();

var c1 = Color("#80bbe7");
var c2 = Color("#ffbf85");
var c3 = c1.clone().mix(c2, 0.5).negate();

var set1 = Immutable.Map({
  size: currentUrls,
  color: c1.rgbString(),
  label: "New URLs" });

var set2 = Immutable.Map({
  size: previousUrls,
  color: c2.rgbString(),
  label: "Disappeared URLs" });

vennData.addSet(set1);
vennData.addSet(set2);

var set3 = Immutable.Map({
  size: commonUrls,
  color: c3.rgbString(),
  label: "Common URLs" });

vennData.addIntersection(Immutable.Set.of(set1, set2), set3);

var ChartRenderer = React.createClass({
  displayName: "ChartRenderer",

  getImageURI: function getImageURI() {
    return this.refs.chart.getImageURI();
  },

  render: function render() {
    var style = {
      width: 1000,
      height: 500
    };

    return React.createElement(
      "div",
      { style: style },
      this.props.render()
    );
  }

});

var SpecificPanelController = React.createClass({

  displayName: "SpecificPanelController",

  render: function render() {
    return React.createElement(Panel, {
      title: "Hello world",
      defaultDisplayModeId: "vennDiagram",
      displayModes: this._getDisplayModes(),
      actions: this._getActions()
    });
  },

  _getDisplayModes: function _getDisplayModes() {
    return [{
      id: "vennDiagram",
      label: "Display Venn Diagram",
      render: this._renderVennDiagram
    }, {
      id: "chart",
      label: "Display Chart",
      render: this._renderChart
    }, {
      id: "table",
      label: "Display Table",
      render: this._renderTable
    }];
  },

  _getActions: function _getActions() {
    return [{
      id: "exportChart",
      label: "Export Chart",
      callback: this._exportChart
    }];
  },

  _renderChart: function _renderChart() {
    return React.createElement(Chart, {
      key: "columnChart",
      ref: "chart",
      chart: GoogleColumnChart,
      chartData: chartData
    });
  },

  _renderVennDiagram: function _renderVennDiagram() {
    return React.createElement(VennDiagram, {
      key: "vennDiagram",
      vennData: vennData,
      inclusive: true
    });
  },

  _renderTable: function _renderTable() {
    return React.createElement(Table, {
      key: "table",
      chartData: chartData
    });
  },

  _exportChart: function _exportChart() {
    var div = document.createElement("div");
    document.body.appendChild(div);

    var style = {
      width: 1000,
      height: 500
    };

    var chart = React.render(React.createElement(ChartRenderer, { render: this._renderChart }), div);

    var imageURI = chart.getImageURI();
    window.open(imageURI);

    document.body.removeChild(div);
  }

});

module.exports = SpecificPanelController;