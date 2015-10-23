import { Map, OrderedMap } from 'immutable';
import { isNumber } from 'lodash';

/**
 * @structure DataKeys
 * Map<Any,Any>  =>  <dimension key, group key>
 */

/**
 * @structure Dimension
 * Map({
 *   groups: OrderMap<Any, DimensionGroup>
 *   label: String,
 *   ...
 * })
 */

/**
 * @structure DimensionGroup
 * Map({
 *   label: String,
 *   color: String,
 *   ...
 * })
 */

/**
 * @property {Map<DataKeys, Number>}    rawData
 * @property {OrderMap<Any, Dimension>} dimensions
 */
class ChartData {

  constructor() {
    this.rawData = Map();
    this.dimensions = OrderedMap();
  }

  /**
   * @param {DataKeys} keys
   * @param {Number}   value
   */
  setData(keys, value) {
    this._testDataKeys(keys);
    this._testDataValue(value);

    // Add data
    this.rawData = this.rawData.set(keys, value);

    // Add dimensions or/and groups if not exist
    keys.forEach((groupKey, dimKey) => {
      if (!this.hasDimensionGroup(dimKey, groupKey)) {
        this.addDimensionGroup(dimKey, groupKey);
      }
    });
  }

  _testDataKeys(keys) {
    if (!Map.isMap(keys)) {
      throw new TypeError('DataKeys is not an Map');
    }
  }
  _testDataValue(value) {
    if (!isNumber(value)) {
      throw new TypeError('Value is not a number');
    }
  }

  /**
   * @param {DataKeys} keys
   * @return {Any}
   */
  getData(keys) {
    return this.rawData.get(keys);
  }

  /**
   * Filter RawData according to given filters
   * @param  {DataKeys} filters
   * @return {Map}
   */
  filterData(filters) {
    if (!filters) {
      return this.rawData;
    }
    return this.rawData.filter((value, key) => filters.isSubset(key));
  }

  /**
   * @param {Any} dimKey
   * @param {Map<String,Any>} dimMetadata {label: <String>, color: <String>, ...}
   */
  addDimension(dimKey, dimMetadata = Map()) {
    if (!Map.isMap(dimMetadata)) {
      throw new TypeError('dimMetadata is not a Map');
    }
    let dimensionValue = dimMetadata.set('groups', OrderedMap());

    this.dimensions = this.dimensions.set(dimKey, dimensionValue);
  }

  getDimensionKeyByIndex(index, fromEnd) {
    index = fromEnd ? (this.dimensions.count() - 1) - index : index;
    return this.dimensions.keySeq().get(index);
  }

  /**
   * @param {Any} dimKey
   * @return {Dimension}
   */
  getDimension(dimKey) {
    return this.dimensions.get(dimKey);
  }

  /**
   * @param {Any} dimKey
   * @return {Boolean}
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
      throw new TypeError('groupMetadata is not a Map');
    }
    this.dimensions = this.dimensions.setIn([dimKey, 'groups', groupKey], groupMetadata);
  }

  /**
   * @param {Any} dimKey
   * @param {Any} groupKey
   * @return {DimensionGroup}
   */
  getDimensionGroup(dimKey, groupKey) {
    return this.dimensions.getIn([dimKey, 'groups', groupKey]);
  }

  /**
   * @param {Any} dimKey
   * @param {Any} groupKey
   * @return {Boolean}
   */
  hasDimensionGroup(dimKey, groupKey) {
    return this.dimensions.hasIn([dimKey, 'groups', groupKey]);
  }
}

export default ChartData;
