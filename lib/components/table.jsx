"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var React = _interopRequire(require("react"));

var DataTable = _interopRequire(require("datatables"));

require("datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.css");

require("datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.js");

var Table = React.createClass({

  displayName: "Table",

  statics: {
    getDefaultDisplayModeId: function getDefaultDisplayModeId() {
      return "table";
    },

    getDisplayModes: function getDisplayModes() {
      return [{
        id: "table",
        label: "Display Table"
      }];
    },

    getActions: function getActions() {
      return [{
        id: "export table",
        methodName: "exportTable",
        label: "Export CSV"
      }];
    }
  },

  exportTable: function exportTable() {
    console.log("Exporting table!");
  },

  componentDidMount: function componentDidMount() {
    $(this.refs.table.getDOMNode()).dataTable(this._getOptions());
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "Table" },
      React.createElement("table", { ref: "table", className: "table table-striped table-bordered dataTable no-footer" })
    );
  },

  _getData: function _getData() {
    var _this = this;

    return this.props.chartData.rawData.entrySeq().map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var dataKeys = _ref2[0];
      var dataValues = _ref2[1];

      var groups = dataKeys.entrySeq().map(function (_ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var dimKey = _ref32[0];
        var groupKey = _ref32[1];

        var group = _this.props.chartData.getDimensionGroup(dimKey, groupKey);
        return group.get("label");
      });

      var metrics = dataValues.map(function (value, index) {
        var metric = _this.props.chartData.getMetric(index);
        return metric.get("render")(value);
      });

      return groups.concat(metrics);
    }).toJS();
  },

  _getColumns: function _getColumns() {
    var dimensions = this.props.chartData.dimensions.entrySeq().map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var dimensionKey = _ref2[0];
      var dimensionMetadata = _ref2[1];

      return {
        title: dimensionMetadata.get("label")
      };
    });

    var metrics = this.props.chartData.metrics.map(function (metric) {
      return {
        title: metric.get("label")
      };
    });

    return dimensions.concat(metrics).toJS();
  },

  _getOptions: function _getOptions() {
    var _this = this;

    return {
      data: this._getData(),
      columns: this._getColumns(),
      paging: false,
      searching: false,
      info: false,
      drawCallback: function () {
        _this.forceUpdate();
      }
    };
  }

});

module.exports = Table;