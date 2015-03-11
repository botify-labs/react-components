"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

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

  _prototypeProperties(ChartData, null, {
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
      },
      writable: true,
      configurable: true
    },
    _testDataKeys: {
      value: function _testDataKeys(keys) {
        if (!Map.isMap(keys)) {
          throw new TypeError("DataKeys is not an Map");
        }
      },
      writable: true,
      configurable: true
    },
    _testDataValues: {
      value: function _testDataValues(values) {
        if (!List.isList(values)) {
          throw new TypeError("DataValues is not a List");
        }
      },
      writable: true,
      configurable: true
    },
    getData: {

      /**
       * @param {DataKeys} keys
       */

      value: function getData(keys) {
        return this.rawData.get(keys);
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
    },
    addMetric: {

      /**
       * @param {Map} metricMetadata
       */

      value: function addMetric() {
        var metricMetadata = arguments[0] === undefined ? Map() : arguments[0];

        this.metrics = this.metrics.push(metricMetadata);
      },
      writable: true,
      configurable: true
    },
    getMetric: {

      /**
       * @param   {Number} index
       * @return  {Map}
       */

      value: function getMetric(index) {
        return this.metrics.get(index);
      },
      writable: true,
      configurable: true
    },
    hasMetric: {

      /**
       * @param   {Number} index
       * @return  {Boolean}
       */

      value: function hasMetric(index) {
        return this.metrics.has(index);
      },
      writable: true,
      configurable: true
    },
    addDimension: {

      /**
       * @param {Any} dimKey
       * @param {Map<String,Any>} dimMetadata {label: <String>, color: <String>, ...}
       */

      value: function addDimension(dimKey) {
        var dimMetadata = arguments[1] === undefined ? Map() : arguments[1];

        var dimensionValue = dimMetadata.set("groups", OrderedMap());

        this.dimensions = this.dimensions.set(dimKey, dimensionValue);
      },
      writable: true,
      configurable: true
    },
    getDimensionKeyByIndex: {
      value: function getDimensionKeyByIndex(index, fromEnd) {
        var start = !fromEnd ? index : -(index + 1),
            end = start + 1 !== 0 ? start + 1 : undefined;
        return this.dimensions.keySeq().get(index);
      },
      writable: true,
      configurable: true
    },
    getDimension: {

      /**
       * @param {Any} dimKey
       */

      value: function getDimension(dimKey) {
        return this.dimensions.get(dimKey);
      },
      writable: true,
      configurable: true
    },
    hasDimension: {
      /**
       * @param {Any} dimKey
       */

      value: function hasDimension(dimKey) {
        return this.dimensions.has(dimKey);
      },
      writable: true,
      configurable: true
    },
    addDimensionGroup: {

      /**
       * @param {Any} dimKey
       * @param {Any} groupKey
       * @param {Map<String,Any>} groupMetadata {label: <String>, color: <String>, ...}
       */

      value: function addDimensionGroup(dimKey, groupKey) {
        var groupMetadata = arguments[2] === undefined ? Map() : arguments[2];

        //Add dimension if not exist
        if (!this.hasDimension(dimKey)) {
          throw new Error("you can't add group to an unexisting group");
        }

        this.dimensions = this.dimensions.setIn([dimKey, "groups", groupKey], groupMetadata);
      },
      writable: true,
      configurable: true
    },
    getDimensionGroup: {
      /**
       * @param {Any} dimKey
       * @param {Any} groupKey
       */

      value: function getDimensionGroup(dimKey, groupKey) {
        return this.dimensions.getIn([dimKey, "groups", groupKey]);
      },
      writable: true,
      configurable: true
    },
    hasDimensionGroup: {
      /**
       * @param {Any} dimKey
       * @param {Any} groupKey
       */

      value: function hasDimensionGroup(dimKey, groupKey) {
        return this.dimensions.hasIn([dimKey, "groups", groupKey]);
      },
      writable: true,
      configurable: true
    }
  });

  return ChartData;
})();

module.exports = ChartData;
//# sourceMappingURL=../models/ChartData.js.map