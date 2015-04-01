
import {List, Map, OrderedMap} from 'immutable';

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
class ChartData{

  constructor() {
    this.rawData = Map();
    this.dimensions = OrderedMap();
    this.metrics = List();
  }

  /**
   * @param {DataKeys} keys
   * @param {DataValues} values
   */
  setData(keys, values) {
    this._testDataKeys(keys);
    this._testDataValues(values);

    //Add data
    this.rawData = this.rawData.set(keys, values);

    //Add dimensions or/and groups if not exist
    keys.forEach((groupKey, dimKey) => {
      if (!this.hasDimensionGroup(dimKey, groupKey)) {
        this.addDimensionGroup(dimKey, groupKey);
      }
    });
  }

  _testDataKeys(keys) {
    if (!Map.isMap(keys)) {
      throw new TypeError("DataKeys is not an Map");
    }
  }
  _testDataValues(values) {
    if (!List.isList(values)) {
      throw new TypeError("DataValues is not a List");
    }
  }

  /**
   * @param {DataKeys} keys
   */
  getData(keys) {
    return this.rawData.get(keys);
  }

  /**
   * Filter RawData according to given filters
   * @param  {DataKeys} filters
   */
  filterData(filters) {
    if (!filters) {
      return this.rawData;
    }
    return this.rawData.filter((value, key) => filters.isSubset(key));
  }

  /**
   * @param {Map} metricMetadata
   */
  addMetric(metricMetadata = Map()) {
    if (!Map.isMap(metricMetadata)) {
      throw new TypeError("metricMetadata is not a Map");
    }
    this.metrics = this.metrics.push(metricMetadata);
  }

  /**
   * @param   {Number} index
   * @return  {Map}
   */
  getMetric(index) {
    return this.metrics.get(index);
  }

  /**
   * @param   {Number} index
   * @return  {Boolean}
   */
  hasMetric(index) {
    return this.metrics.has(index);
  }

  /**
   * @param {Any} dimKey
   * @param {Map<String,Any>} dimMetadata {label: <String>, color: <String>, ...}
   */
  addDimension(dimKey, dimMetadata = Map()) {
    if (!Map.isMap(dimMetadata)) {
      throw new TypeError("dimMetadata is not a Map");
    }
    var dimensionValue = dimMetadata.set('groups', OrderedMap());

    this.dimensions = this.dimensions.set(dimKey, dimensionValue);
  }

  getDimensionKeyByIndex(index, fromEnd) {
    index = fromEnd ? (this.dimensions.count() - 1) - index : index;
    return this.dimensions.keySeq().get(index);
  }

  /**
   * @param {Any} dimKey
   */
  getDimension(dimKey) {
    return this.dimensions.get(dimKey);
  }
  /**
   * @param {Any} dimKey
   */
  hasDimension(dimKey) {
    return this.dimensions.has(dimKey);
  }

  /**
   * @param {Any} dimKey
   * @param {Any} groupKey
   * @param {Map<String,Any>} groupMetadata {label: <String>, color: <String>, ...}
   */
  addDimensionGroup(dimKey, groupKey, groupMetadata = Map()) {
    if (!this.hasDimension(dimKey)) {
      throw new Error("you can't add a dimension group to a dimension that doesn't exist");
    }
    if (!Map.isMap(groupMetadata)) {
      throw new TypeError("groupMetadata is not a Map");
    }
    this.dimensions = this.dimensions.setIn([dimKey, 'groups', groupKey], groupMetadata);
  }
  /**
   * @param {Any} dimKey
   * @param {Any} groupKey
   */
  getDimensionGroup(dimKey, groupKey) {
    return this.dimensions.getIn([dimKey, 'groups', groupKey]);
  }
  /**
   * @param {Any} dimKey
   * @param {Any} groupKey
   */
  hasDimensionGroup(dimKey, groupKey) {
    return this.dimensions.hasIn([dimKey, 'groups', groupKey]);
  }
}

export default ChartData;
