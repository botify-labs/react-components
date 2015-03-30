"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _immutable = require("immutable");

var List = _immutable.List;
var Map = _immutable.Map;
var OrderedMap = _immutable.OrderedMap;

/**
 * @structure DataKeys
 * Map<Any,Any>  //<dimension key, group key>
 */

/**
 * @structure DataValues
 * List<Any>
 */

/**
 * @structure Dimension
 * Map({
 *   label: String,
 *   render: function(data),
 *   Any: Any
 *   groups: OrderMap<Any, DimensionGroup>
 * })
 */

/**
 * @structure DimensionGroup
 * Map({
 *   label: String,
 *   color: String,
 *   Any: Any
 * })
 */

/**
 * @property {Map<DataKeys, DataValues>}  data
 * @property {OrderMap<Any, Dimension>}   dimensions
 * @property {List<Metric>}               metrics
 */

var ChartData = (function () {
  function ChartData() {
    _classCallCheck(this, ChartData);

    this.rawData = Map();
    this.dimensions = OrderedMap();
    this.metrics = List();
  }

  _createClass(ChartData, {
    setData: {

      /**
       * @param {DataKeys} keys
       * @param {DataValues} values
       */

      value: function setData(keys, values) {
        var _this = this;

        this._testDataKeys(keys);
        this._testDataValues(values);

        //Add data
        this.rawData = this.rawData.set(keys, values);

        //Add dimensions or/and groups if not exist
        keys.forEach(function (groupKey, dimKey) {
          if (!_this.hasDimensionGroup(dimKey, groupKey)) {
            _this.addDimensionGroup(dimKey, groupKey);
          }
        });
      }
    },
    _testDataKeys: {
      value: function _testDataKeys(keys) {
        if (!Map.isMap(keys)) {
          throw new TypeError("DataKeys is not an Map");
        }
      }
    },
    _testDataValues: {
      value: function _testDataValues(values) {
        if (!List.isList(values)) {
          throw new TypeError("DataValues is not a List");
        }
      }
    },
    getData: {

      /**
       * @param {DataKeys} keys
       */

      value: function getData(keys) {
        return this.rawData.get(keys);
      }
    },
    filterData: {

      /**
       * Filter RawData according to given filters
       * @param  {DataKeys} filters
       */

      value: function filterData(filters) {
        if (!filters) {
          return this.rawData;
        }
        return this.rawData.filter(function (value, key) {
          return filters.isSubset(key);
        });
      }
    },
    addMetric: {

      /**
       * @param {Map} metricMetadata
       */

      value: function addMetric() {
        var metricMetadata = arguments[0] === undefined ? Map() : arguments[0];

        if (!Map.isMap(metricMetadata)) {
          throw new TypeError("metricMetadata is not a Map");
        }
        this.metrics = this.metrics.push(metricMetadata);
      }
    },
    getMetric: {

      /**
       * @param   {Number} index
       * @return  {Map}
       */

      value: function getMetric(index) {
        return this.metrics.get(index);
      }
    },
    hasMetric: {

      /**
       * @param   {Number} index
       * @return  {Boolean}
       */

      value: function hasMetric(index) {
        return this.metrics.has(index);
      }
    },
    addDimension: {

      /**
       * @param {Any} dimKey
       * @param {Map<String,Any>} dimMetadata {label: <String>, color: <String>, ...}
       */

      value: function addDimension(dimKey) {
        var dimMetadata = arguments[1] === undefined ? Map() : arguments[1];

        if (!Map.isMap(dimMetadata)) {
          throw new TypeError("dimMetadata is not a Map");
        }
        var dimensionValue = dimMetadata.set("groups", OrderedMap());

        this.dimensions = this.dimensions.set(dimKey, dimensionValue);
      }
    },
    getDimensionKeyByIndex: {
      value: function getDimensionKeyByIndex(index, fromEnd) {
        index = fromEnd ? this.dimensions.count() - 1 - index : index;
        return this.dimensions.keySeq().get(index);
      }
    },
    getDimension: {

      /**
       * @param {Any} dimKey
       */

      value: function getDimension(dimKey) {
        return this.dimensions.get(dimKey);
      }
    },
    hasDimension: {
      /**
       * @param {Any} dimKey
       */

      value: function hasDimension(dimKey) {
        return this.dimensions.has(dimKey);
      }
    },
    addDimensionGroup: {

      /**
       * @param {Any} dimKey
       * @param {Any} groupKey
       * @param {Map<String,Any>} groupMetadata {label: <String>, color: <String>, ...}
       */

      value: function addDimensionGroup(dimKey, groupKey) {
        var groupMetadata = arguments[2] === undefined ? Map() : arguments[2];

        if (!this.hasDimension(dimKey)) {
          throw new Error("you can't add a dimension group to a dimension that doesn't exist");
        }
        if (!Map.isMap(groupMetadata)) {
          throw new TypeError("groupMetadata is not a Map");
        }
        this.dimensions = this.dimensions.setIn([dimKey, "groups", groupKey], groupMetadata);
      }
    },
    getDimensionGroup: {
      /**
       * @param {Any} dimKey
       * @param {Any} groupKey
       */

      value: function getDimensionGroup(dimKey, groupKey) {
        return this.dimensions.getIn([dimKey, "groups", groupKey]);
      }
    },
    hasDimensionGroup: {
      /**
       * @param {Any} dimKey
       * @param {Any} groupKey
       */

      value: function hasDimensionGroup(dimKey, groupKey) {
        return this.dimensions.hasIn([dimKey, "groups", groupKey]);
      }
    }
  });

  return ChartData;
})();

module.exports = ChartData;
//# sourceMappingURL=../models/ChartData.js.map