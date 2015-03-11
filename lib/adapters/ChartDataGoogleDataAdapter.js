"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _immutable = require("immutable");

var List = _immutable.List;
var Map = _immutable.Map;
var OrderedMap = _immutable.OrderedMap;

/**
 * @property {Map} _axes Map of axes relative dimension key
 * @param {[type]} chartData [description]
 */

var ChartDataGoogleDataAdapter = (function () {
  function ChartDataGoogleDataAdapter(chartData) {
    _classCallCheck(this, ChartDataGoogleDataAdapter);

    this.chartData = chartData;
    this._axesKey = Map();
    return this;
  }

  _prototypeProperties(ChartDataGoogleDataAdapter, null, {
    toGoogleDataArray: {

      /**
       * @param  {Map} options
       * {
       *   axes: Map<AxisName, DimensionsKey>  AxisName € ['categories, series']
       *   filters: Map<DimensionsKey, GroupKey>
       * }
       * @note
       *  - Data is sum on unviable dimensions unless filters options are provided
       *  - If axes option is not provided, it uses the last two dimensions in the ChartData
       */

      value: function toGoogleDataArray() {
        var options = arguments[0] === undefined ? Map() : arguments[0];

        this._setAxes(options.get("axes"));
        var valuesArray = this._getGoogleValuesArray(options.get("filters"));

        var _getAxesLabels = this._getAxesLabels();

        var _getAxesLabels2 = _slicedToArray(_getAxesLabels, 2);

        var categoriesLabels = _getAxesLabels2[0];
        var seriesLabels = _getAxesLabels2[1];

        //Merge valuesArray and labels in the google shitty way
        //                     series
        //                S1 S2 S3 S4 S5 S6
        //            C1  X  X  X  X  X  X
        //            C2  X              X
        // categories C3  X  ValuesArray X
        //            C4  X              X
        //            C5  X  X  X  X  X  X
        var googleDataArray = List();
        googleDataArray = googleDataArray.push(seriesLabels.unshift(""));
        categoriesLabels.forEach(function (label, i) {
          googleDataArray = googleDataArray.push(valuesArray.get(i).unshift(label));
        });

        return google.visualization.arrayToDataTable(googleDataArray.toJS());
      },
      writable: true,
      configurable: true
    },
    toGoogleOptions: {
      value: function toGoogleOptions(percentage) {
        /*var googleOptions = this.chartData.options.merge(Map(  //DEFAULT OPTIONS TO BE PUT IN CHART COMPONENT
          {
            series: {},
            vAxis: {
                format: percentage ? '#,###.#%' : '#,###.#',
            },
            hAxis: {
                format: percentage ? '#,###.#%' : '#,###.#',
            },
            tooltip: {
                trigger: "none"
            }
          }
        ));*/
        var googleOptions = Map();

        googleOptions.set("series", this._getSeries().get("groups").map(function (group, key) {
          return Map({ color: group.get("color") });
        }).toList());

        return googleOptions;
      },
      writable: true,
      configurable: true
    },
    selectionToDataKeys: {

      /**
       * Converts Google Chart selection to DataKeys
       * @param  {Object}   {row, column}
       * @return {DataKeys}
       */

      value: function selectionToDataKeys(_ref) {
        var row = _ref.row;
        var column = _ref.column;

        var filter = Map();

        // Series are indexed starting from 1, while categories are indexed starting from 0
        var series = this._getSeries();
        var serieKey = series.get("groups").keySeq().get(column - 1);
        filter = filter.set(series.get("key"), serieKey);
        if (row !== null) {
          var categories = this._getCategories();
          var categoryKey = categories.get("groups").keySeq().get(row);
          filter = filter.set(categories.get("key"), categoryKey);
        }

        return filter;
      },
      writable: true,
      configurable: true
    },
    _getCategories: {
      value: function _getCategories() {
        return this._getAxis(this._axesKey.get("categories"));
      },
      writable: true,
      configurable: true
    },
    _getSeries: {
      value: function _getSeries() {
        return this._getAxis(this._axesKey.get("series"));
      },
      writable: true,
      configurable: true
    },
    _getGoogleValuesArray: {
      value: function _getGoogleValuesArray(filters) {
        var googleValuesArray = this._getEmptyGoogleValuesArray(),
            data = this.chartData.filterData(filters),
            categories = this._getCategories(),
            series = this._getSeries();

        //Iterate on each data and set it's value in the proper cell
        data.map(function (value, key) {
          var xIndex = categories.get("groupKeys").indexOf(key.get(categories.get("key")));
          var yIndex = series.get("groupKeys").indexOf(key.get(series.get("key")));
          if (xIndex === -1 || yIndex === -1) {
            throw new Error("data [" + key + "," + value + "] have a dimension group's key undefined");
          }

          googleValuesArray = googleValuesArray.setIn([xIndex, yIndex], value.get(0) + googleValuesArray.getIn([xIndex, yIndex]) //Add to existing value
          );
        });
        return googleValuesArray;
      },
      writable: true,
      configurable: true
    },
    _getEmptyGoogleValuesArray: {
      value: function _getEmptyGoogleValuesArray() {
        var googleValuesArray = List();
        for (var x = 0; x < this._getCategories().get("groupKeys").size; x++) {
          googleValuesArray = googleValuesArray.push(new List());
          for (var y = 0; y < this._getSeries().get("groupKeys").size; y++) {
            googleValuesArray = googleValuesArray.setIn([x, y], 0);
          }
        }
        return googleValuesArray;
      },
      writable: true,
      configurable: true
    },
    _setAxes: {

      /**
       * categories axis is the last dimension unless a specific option have been set
       * series axis is the last-1 dimension unless a specific option have been set
       */

      value: function _setAxes() {
        var axisKeys = arguments[0] === undefined ? Map() : arguments[0];

        this._axesKey = this._axesKey.set("categories", axisKeys.get("categories") || this.chartData.getDimensionKeyByIndex(0, true));

        this._axesKey = this._axesKey.set("series", axisKeys.get("series") || this.chartData.getDimensionKeyByIndex(1, true));
      },
      writable: true,
      configurable: true
    },
    _getAxis: {

      /**
       * Return ChartData relative dimension and precomute helpers
       * @return {Dimension}
       */

      value: function _getAxis(axisKey) {
        var dimension = this.chartData.getDimension(axisKey);
        return dimension.set("key", axisKey).set("groupKeys", dimension.get("groups").keySeq());
      },
      writable: true,
      configurable: true
    },
    _getAxesLabels: {

      /*_getAxisInfo(dimensionKey){
        var info = Map();
        info = info.set('key', dimensionKey);
        info = info.set('value', this.chartData.getDimension(dimensionKey));
        info = info.set('groupKeys', info.get('value').get('groups').keySeq());
        return info;
      }*/

      value: function _getAxesLabels() {
        return [this._getCategories().get("groups").map(function (group, key) {
          return group.get("label") || key;
        }).toList(), this._getSeries().get("groups").map(function (group, key) {
          return group.get("label") || key;
        }).toList()];
      },
      writable: true,
      configurable: true
    }
  });

  return ChartDataGoogleDataAdapter;
})();

module.exports = ChartDataGoogleDataAdapter;
//# sourceMappingURL=../adapters/ChartDataGoogleDataAdapter.js.map