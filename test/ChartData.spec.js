import { Map, List, Set } from 'immutable';
import ChartData from '../src/models/ChartData';

describe('ChartData', () => {
  let chartData;
  beforeEach(() => {
    chartData = new ChartData();
  });

  describe('addDimension()', () => {
    it('should validate the type of its arguments', () => {
      const invalidMetadata = { label: 'speed' };
      expect(() => chartData.addDimension('speed', invalidMetadata)).toThrow();
    });

    it('should add a dimension to the list of dimensions', () => {
      const dimMetadata = Map({ label: 'speed' });
      chartData.addDimension('speed', dimMetadata);
      expect(chartData.dimensions.get('speed')).toExist();
      expect(chartData.dimensions.get('speed').get('label')).toBe('speed');
    });
  });

  describe('getDimension()', () => {
    it('should return a dimension from a dimension key', () => {
      const dimMetadata = Map({ label: 'speed' });
      chartData.addDimension('speed', dimMetadata);
      expect(chartData.getDimension('speed')).toExist();
      expect(chartData.getDimension('speed').get('label')).toBe('speed');
    });
  });

  describe('getDimensionKeyByIndex()', () => {
    it('should return a dimension key from an index of insertion', () => {
      const dimMetadata1 = Map({ label: 'speed' });
      const dimMetadata2 = Map({ label: 'hello' });
      const dimMetadata3 = Map({ label: 'okay' });
      chartData.addDimension('speed', dimMetadata1);
      chartData.addDimension('hello', dimMetadata2);
      chartData.addDimension('okay', dimMetadata3);
      expect(chartData.getDimensionKeyByIndex(0)).toBe('speed');
      expect(chartData.getDimensionKeyByIndex(1)).toBe('hello');
      expect(chartData.getDimensionKeyByIndex(2)).toBe('okay');
    });

    it('should return a dimension key from an index of insertion relative to the end', () => {
      const dimMetadata1 = Map({ label: 'speed' });
      const dimMetadata2 = Map({ label: 'hello' });
      const dimMetadata3 = Map({ label: 'okay' });
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
      const dimMetadata = Map({ label: 'speed' });
      chartData.addDimension('speed', dimMetadata);
      expect(chartData.hasDimension('speed')).toBe(true);
      expect(chartData.hasDimension('hello')).toBe(false);
    });
  });

  describe('addDimensionGroup()', () => {
    it('should validate the type of its arguments', () => {
      const dimMetadata = Map({ label: 'speed' });
      const invalidGroupMetadata = { label: 'fast' };
      const groupMetadata = Map({ label: 'fast' });
      chartData.addDimension('speed', dimMetadata);
      expect(() => chartData.addDimensionGroup('speed', 'fast', invalidGroupMetadata)).toThrow();
      expect(() => chartData.addDimensionGroup('speed', 'fast', groupMetadata)).toNotThrow();
    });

    it('should throw if we\'re trying to add a group to an unknown dimension', () => {
      const groupMetadata = Map({ label: 'fast' });
      expect(() => chartData.addDimensionGroup('speed', 'fast', groupMetadata)).toThrow();
    });

    it('should add a group to the groups of a dimension', () => {
      const groupMetadata = Map({ label: 'fast' });
      chartData.addDimension('speed', Map({ label: 'speed' }));
      chartData.addDimensionGroup('speed', 'fast', groupMetadata);
      expect(chartData.getDimension('speed').get('groups').contains(groupMetadata)).toBe(true);
    });
  });

  describe('getDimensionGroup()', () => {
    it('should return a group from a dimension key and a group key', () => {
      const dimMetadata = Map({ label: 'speed' });
      const groupMetadata = Map({ label: 'fast' });
      chartData.addDimension('speed', dimMetadata);
      chartData.addDimensionGroup('speed', 'fast', groupMetadata);
      expect(chartData.getDimensionGroup('speed', 'fast')).toBe(groupMetadata);
    });
  });

  describe('hasDimensionGroup()', () => {
    it('should return true if a group exists, false otherwise', () => {
      const dimMetadata = Map({ label: 'speed' });
      const groupMetadata = Map({ label: 'fast' });
      expect(chartData.hasDimensionGroup('speed', 'fast')).toBe(false);
      chartData.addDimension('speed', dimMetadata);
      expect(chartData.hasDimensionGroup('speed', 'fast')).toBe(false);
      chartData.addDimensionGroup('speed', 'fast', groupMetadata);
      expect(chartData.hasDimensionGroup('speed', 'fast')).toBe(true);
    });
  });

  describe('setData()', () => {
    it('should validate the type of its arguments', () => {
      const invalidKeys = { speed: 'fast' };
      const invalidValue = List.of(0, 1, 2, 3);
      const keys = Map({ speed: 'fast' });
      const value = 1;
      chartData.addDimension('speed', Map({ label: 'speed' }));
      expect(() => chartData.setData(invalidKeys, value)).toThrow();
      expect(() => chartData.setData(keys, invalidValue)).toThrow();
      expect(() => chartData.setData(invalidKeys, invalidValue)).toThrow();
      expect(() => chartData.setData(keys, value)).toNotThrow();
    });

    it('should throw if `dataKeys` refers to an unknown dimension', () => {
      const keys = Map({ speed: 'fast' });
      const value = 0;
      expect(() => chartData.setData(keys, value)).toThrow();
    });

    it('should automatically add new dimension groups if they didn\'t exist before', () => {
      const keys1 = Map({ speed: 'fast' });
      const keys2 = Map({ speed: 'slow', hello: 'world' });
      const value = 0;
      chartData.addDimension('speed', Map({ label: 'speed' }));
      chartData.addDimension('hello', Map({ label: 'hello' }));
      chartData.setData(keys1, value);
      chartData.setData(keys2, value);
      expect(chartData.getDimensionGroup('speed', 'fast')).toExist();
      expect(chartData.getDimensionGroup('speed', 'slow')).toExist();
      expect(chartData.getDimensionGroup('hello', 'world')).toExist();
    });

    it('should add data to the map of data', () => {
      const keys = Map({ speed: 'fast' });
      const value = 0;
      chartData.addDimension('speed', Map({ label: 'speed' }));
      chartData.setData(keys, value);
      expect(chartData.rawData.get(keys)).toBe(value);
    });
  });

  describe('getData()', () => {
    it('should return DataValues from DataKeys', () => {
      const keys1 = Map({ speed: 'fast' });
      const keys2 = Map({ speed: 'slow' });
      chartData.addDimension('speed', Map({ label: 'speed' }));
      const value1 = 1;
      const value2 = 2;
      chartData.setData(keys1, value1);
      chartData.setData(keys2, value2);
      expect(chartData.getData(keys1)).toBe(value1);
      expect(chartData.getData(keys2)).toBe(value2);
    });
  });

  function createDataKeys(dimensions, keysByDepth = {}, keys = Map(), depth = 0) {
    dimensions.forEach(([dimensionKey, dimensionValues]) => {
      const remainingDimensions = dimensions.slice(1);
      dimensionValues.forEach((dimensionValue) => {
        const newKeys = keys.set(dimensionKey, dimensionValue);
        keysByDepth[depth] = keysByDepth[depth] || Set();
        keysByDepth[depth] = keysByDepth[depth].add(newKeys);
        createDataKeys(remainingDimensions, keysByDepth, newKeys, depth + 1);
      });
    });
    return keysByDepth;
  }

  describe('filterData()', () => {
    it('should return data whose keys are a superset of the given keys', () => {
      const dimensions = [
        ['speed',
          ['fast', 'slow'],
        ],
        ['type',
          ['html', 'json'],
        ],
      ];
      chartData.addDimension('speed', Map({ label: 'speed '}));
      chartData.addDimension('type', Map({ label: 'type '}));
      const keysByDepth = createDataKeys(dimensions);
      keysByDepth[1].forEach((dataKeys) => {
        chartData.setData(dataKeys, 1);
      });
      const superKeys1 = Map({ speed: 'fast' });
      const filter1 = chartData.filterData(superKeys1);
      expect(filter1.count()).toBe(2);
      expect(filter1.has(Map({ speed: 'fast', type: 'html' }))).toBe(true);
      expect(filter1.has(Map({ speed: 'fast', type: 'json' }))).toBe(true);

      const superKeys2 = Map({ speed: 'slow', type: 'html' });
      const filter2 = chartData.filterData(superKeys2);
      expect(filter2.count()).toBe(1);
      expect(filter2.has(Map({ speed: 'slow', type: 'html' }))).toBe(true);
    });
  });
});
