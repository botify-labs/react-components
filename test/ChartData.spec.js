import { Map, List, Set } from 'immutable';
import ChartData from '../src/models/ChartData';

describe('ChartData', () => {
  let chartData;
  beforeEach(() => {
    chartData = new ChartData();
  });

  describe('addDimension()', () => {

    it('should validate the type of its arguments', () => {
      let invalidMetadata = { label: 'speed' };
      expect(() => chartData.addDimension('speed', invalidMetadata)).toThrow();
    });

    it('should add a dimension to the list of dimensions', () => {
      let dimMetadata = Map({ label: 'speed' });
      chartData.addDimension('speed', dimMetadata);
      expect(chartData.dimensions.get('speed')).toExist();
      expect(chartData.dimensions.get('speed').get('label')).toBe('speed');
    });

  });

  describe('getDimension()', () => {

    it('should return a dimension from a dimension key', () => {
      let dimMetadata = Map({ label: 'speed' });
      chartData.addDimension('speed', dimMetadata);
      expect(chartData.getDimension('speed')).toExist();
      expect(chartData.getDimension('speed').get('label')).toBe('speed');
    });

  });

  describe('getDimensionKeyByIndex()', () => {

    it('should return a dimension key from an index of insertion', () => {
      let dimMetadata1 = Map({ label: 'speed' });
      let dimMetadata2 = Map({ label: 'hello' });
      let dimMetadata3 = Map({ label: 'okay' });
      chartData.addDimension('speed', dimMetadata1);
      chartData.addDimension('hello', dimMetadata2);
      chartData.addDimension('okay', dimMetadata3);
      expect(chartData.getDimensionKeyByIndex(0)).toBe('speed');
      expect(chartData.getDimensionKeyByIndex(1)).toBe('hello');
      expect(chartData.getDimensionKeyByIndex(2)).toBe('okay');
    });

    it('should return a dimension key from an index of insertion relative to the end', () => {
      let dimMetadata1 = Map({ label: 'speed' });
      let dimMetadata2 = Map({ label: 'hello' });
      let dimMetadata3 = Map({ label: 'okay' });
      chartData.addDimension('speed', dimMetadata1);
      chartData.addDimension('hello', dimMetadata2);
      chartData.addDimension('okay', dimMetadata3);
      expect(chartData.getDimensionKeyByIndex(0, true)).toBe('okay');
      expect(chartData.getDimensionKeyByIndex(1, true)).toBe('hello');
      expect(chartData.getDimensionKeyByIndex(2, true)).toBe('speed');
    });

  });

  describe('hasDimension()', () => {

    it('should return true if a dimension exists, false otherwise', () => {
      let dimMetadata = Map({ label: 'speed' });
      chartData.addDimension('speed', dimMetadata);
      expect(chartData.hasDimension('speed')).toBe(true);
      expect(chartData.hasDimension('hello')).toBe(false);
    });

  });

  describe('addDimensionGroup()', () => {

    it('should validate the type of its arguments', () => {
      let dimMetadata = Map({ label: 'speed' });
      let invalidGroupMetadata = { label: 'fast' };
      let groupMetadata = Map({ label: 'fast' });
      chartData.addDimension('speed', dimMetadata);
      expect(() => chartData.addDimensionGroup('speed', 'fast', invalidGroupMetadata)).toThrow();
      expect(() => chartData.addDimensionGroup('speed', 'fast', groupMetadata)).toNotThrow();
    });

    it('should throw if we\'re trying to add a group to an unknown dimension', () => {
      let groupMetadata = Map({ label: 'fast' });
      expect(() => chartData.addDimensionGroup('speed', 'fast', groupMetadata)).toThrow();
    });

    it('should add a group to the groups of a dimension', () => {
      let groupMetadata = Map({ label: 'fast' });
      chartData.addDimension('speed', Map({ label: 'speed' }));
      chartData.addDimensionGroup('speed', 'fast', groupMetadata);
      expect(chartData.getDimension('speed').get('groups').contains(groupMetadata)).toBe(true);
    });

  });

  describe('getDimensionGroup()', () => {

    it('should return a group from a dimension key and a group key', () => {
      let dimMetadata = Map({ label: 'speed' });
      let groupMetadata = Map({ label: 'fast' });
      chartData.addDimension('speed', dimMetadata);
      chartData.addDimensionGroup('speed', 'fast', groupMetadata);
      expect(chartData.getDimensionGroup('speed', 'fast')).toBe(groupMetadata);
    });

  });

  describe('hasDimensionGroup()', () => {

    it('should return true if a group exists, false otherwise', () => {
      let dimMetadata = Map({ label: 'speed' });
      let groupMetadata = Map({ label: 'fast' });
      expect(chartData.hasDimensionGroup('speed', 'fast')).toBe(false);
      chartData.addDimension('speed', dimMetadata);
      expect(chartData.hasDimensionGroup('speed', 'fast')).toBe(false);
      chartData.addDimensionGroup('speed', 'fast', groupMetadata);
      expect(chartData.hasDimensionGroup('speed', 'fast')).toBe(true);
    });

  });

  describe('addMetric()', () => {

    it('should validate the type of its arguments', () => {
      let metricMetadata = Map({ label: 'count' });
      let invalidMetricMetadata = { label: 'count' };
      expect(() => chartData.addMetric(invalidMetricMetadata)).toThrow();
      expect(() => chartData.addMetric(metricMetadata)).toNotThrow();
    });

    it('should add a metric to the list of metrics', () => {
      let metricMetadata = Map({ label: 'count' });
      chartData.addMetric(metricMetadata);
      expect(chartData.metrics.contains(metricMetadata)).toBe(true);
    });

  });

  describe('getMetric()', () => {

    it('should return a metric from an insertion index', () => {
      let metricMetadata1 = Map({ label: 'count' });
      let metricMetadata2 = Map({ label: 'avg' });
      let metricMetadata3 = Map({ label: 'diff' });
      chartData.addMetric(metricMetadata1);
      chartData.addMetric(metricMetadata2);
      chartData.addMetric(metricMetadata3);
      expect(chartData.metrics.get(0)).toBe(metricMetadata1);
      expect(chartData.metrics.get(1)).toBe(metricMetadata2);
      expect(chartData.metrics.get(2)).toBe(metricMetadata3);
    });

  });

  describe('hasMetric()', () => {

    it('should return true if a metric index exists, false otherwise', () => {
      let metricMetadata = Map({ label: 'count' });
      expect(chartData.hasMetric(0)).toBe(false);
      chartData.addMetric(metricMetadata);
      expect(chartData.hasMetric(0)).toBe(true);
    });

  });

  describe('setData()', () => {

    it('should validate the type of its arguments', () => {
      let invalidKeys = { speed: 'fast' };
      let invalidValues = [0, 1, 2, 3];
      let keys = Map({ speed: 'fast' });
      let values = List.of(0, 1, 2, 3);
      chartData.addDimension('speed', Map({ label: 'speed' }));
      expect(() => chartData.setData(invalidKeys, values)).toThrow();
      expect(() => chartData.setData(keys, invalidValues)).toThrow();
      expect(() => chartData.setData(invalidKeys, invalidValues)).toThrow();
      expect(() => chartData.setData(keys, values)).toNotThrow();
    });

    it('should throw if `dataKeys` refers to an unknown dimension', () => {
      let keys = Map({ speed: 'fast' });
      let values = List.of(0, 1, 2, 3);
      expect(() => chartData.setData(keys, values)).toThrow();
    });

    it('should automatically add new dimension groups if they didn\'t exist before', () => {
      let keys1 = Map({ speed: 'fast' });
      let keys2 = Map({ speed: 'slow', hello: 'world' });
      let values = List.of(0, 1, 2, 3);
      chartData.addDimension('speed', Map({ label: 'speed' }));
      chartData.addDimension('hello', Map({ label: 'hello' }));
      chartData.setData(keys1, values);
      chartData.setData(keys2, values);
      expect(chartData.getDimensionGroup('speed', 'fast')).toExist();
      expect(chartData.getDimensionGroup('speed', 'slow')).toExist();
      expect(chartData.getDimensionGroup('hello', 'world')).toExist();
    });

    it('should add data to the map of data', () => {
      let keys = Map({ speed: 'fast' });
      let values = List.of(0, 1, 2, 3);
      chartData.addDimension('speed', Map({ label: 'speed' }));
      chartData.setData(keys, values);
      expect(chartData.rawData.get(keys)).toBe(values);
    });

  });

  describe('getData()', () => {

    it('should return DataValues from DataKeys', () => {
      let keys1 = Map({ speed: 'fast' });
      let keys2 = Map({ speed: 'slow' });
      chartData.addDimension('speed', Map({ label: 'speed' }));
      let values1 = List.of(0, 1, 2, 3);
      let values2 = List.of(3, 2, 1, 0);
      chartData.setData(keys1, values1);
      chartData.setData(keys2, values2);
      expect(chartData.getData(keys1)).toBe(values1);
      expect(chartData.getData(keys2)).toBe(values2);
    });

  });

  function createDataKeys(dimensions, keysByDepth = {}, keys = Map(), depth = 0) {
    dimensions.forEach(([dimensionKey, dimensionValues]) => {
      let remainingDimensions = dimensions.slice(1);
      dimensionValues.forEach((dimensionValue) => {
        let newKeys = keys.set(dimensionKey, dimensionValue);
        keysByDepth[depth] = keysByDepth[depth] || Set();
        keysByDepth[depth] = keysByDepth[depth].add(newKeys);
        createDataKeys(remainingDimensions, keysByDepth, newKeys, depth + 1);
      });
    });
    return keysByDepth;
  }

  describe('filterData()', () => {

    it('should return data whose keys are a superset of the given keys', () => {
      let dimensions = [
        ['speed',
          ['fast', 'slow'],
        ],
        ['type',
          ['html', 'json'],
        ],
      ];
      chartData.addDimension('speed', Map({ label: 'speed '}));
      chartData.addDimension('type', Map({ label: 'type '}));
      let keysByDepth = createDataKeys(dimensions);
      keysByDepth[1].forEach((dataKeys) => {
        chartData.setData(dataKeys, List());
      });
      let superKeys1 = Map({ speed: 'fast' });
      let filter1 = chartData.filterData(superKeys1);
      expect(filter1.count()).toBe(2);
      expect(filter1.has(Map({ speed: 'fast', type: 'html' }))).toBe(true);
      expect(filter1.has(Map({ speed: 'fast', type: 'json' }))).toBe(true);

      let superKeys2 = Map({ speed: 'slow', type: 'html' });
      let filter2 = chartData.filterData(superKeys2);
      expect(filter2.count()).toBe(1);
      expect(filter2.has(Map({ speed: 'slow', type: 'html' }))).toBe(true);
    });

  });

});
