import { Map, Set } from 'immutable';
import VennData from '../src/models/VennData';

describe('VennData', () => {
  let vennData;
  beforeEach(() => {
    vennData = new VennData();
  });

  // Two sets/intersections with the same key/value pairs are considered by VennData to be the same.
  // So we assign a unique key to every set/intersection.
  let i = 0;
  function set(size) {
    return Map({ key: i++, size });
  }

  let set1 = set(1);
  let set2 = set(2);
  let inter1 = set(3);

  describe('addSet', () => {

    it('should add a set to the list of sets', () => {
      vennData.addSet(set1);
      expect(vennData.getSets().contains(set1)).toBe(true);
    });

    it('should validate the type of its argument', () => {
      let fakeSet = {};
      expect(() => vennData.addSet(fakeSet)).toThrow();
    });

  });

  describe('addIntersection', () => {

    it('should add an intersection to the map of intersections', () => {
      vennData.addSet(set1);
      vennData.addSet(set2);
      let sets = Set.of(set1, set2);
      vennData.addIntersection(sets, inter1);
      expect(vennData.intersections.has(sets)).toBe(true);
      expect(vennData.intersections.get(sets)).toBe(inter1);
    });

    it('should check the sets of an intersection belong to its list of sets', () => {
      vennData.addSet(set1);
      let sets = Set.of(set1, set2);
      expect(() => vennData.addIntersection(sets, inter1)).toThrow();
    });

    it('should validate the type of its `sets` argument', () => {
      vennData.addSet(set1);
      vennData.addSet(set2);
      let fakeSets = [set1, set2];
      expect(() => {
        vennData.addIntersection(fakeSets, inter1);
      }).toThrow();
    });

    it('should validate the type of its `intersection` argument', () => {
      vennData.addSet(set1);
      vennData.addSet(set2);
      let sets = Set.of(set1, set2);
      let fakeIntersection = {};
      expect(() => vennData.addIntersection(sets, fakeIntersection)).toThrow();
    });

  });

  describe('getSizeOf()', () => {

    let set100 = set(100);
    let set200 = set(200);
    let set300 = set(300);
    let inter10 = set(10);
    let inter25 = set(25);
    let inter50 = set(50);
    let inter100 = set(100);

    it('should return the correct size of inclusive sets and intersection', () => {
      vennData.addSet(set100);
      vennData.addSet(set200);
      vennData.addIntersection(Set.of(set100, set200), inter50);
      expect(vennData.getSizeOf(set100, true)).toBe(100);
      expect(vennData.getSizeOf(set200, true)).toBe(200);
      expect(vennData.getSizeOf(inter50, true)).toBe(50);
    });

    it('should return the correct size of exclusive sets and intersection (1 intersection)', () => {
      vennData.addSet(set100);
      vennData.addSet(set200);
      vennData.addIntersection(Set.of(set100, set200), inter50);
      expect(vennData.getSizeOf(set100, false)).toBe(50);
      expect(vennData.getSizeOf(set200, false)).toBe(150);
      expect(vennData.getSizeOf(inter50, false)).toBe(50);
    });

    it('should return the correct size of exclusive sets and intersections (2 2-circles inter)', () => {
      vennData.addSet(set100);
      vennData.addSet(set200);
      vennData.addSet(set300);
      vennData.addIntersection(Set.of(set100, set200), inter50);
      vennData.addIntersection(Set.of(set200, set300), inter100);
      expect(vennData.getSizeOf(set100, false)).toBe(50);
      expect(vennData.getSizeOf(set200, false)).toBe(50);
      expect(vennData.getSizeOf(set300, false)).toBe(200);
      expect(vennData.getSizeOf(inter50, false)).toBe(50);
      expect(vennData.getSizeOf(inter100, false)).toBe(100);
    });

    it('should return the correct size of exclusive sets and intersections (3 2-circles inter)', () => {
      vennData.addSet(set100);
      vennData.addSet(set200);
      vennData.addSet(set300);
      vennData.addIntersection(Set.of(set100, set200), inter25);
      vennData.addIntersection(Set.of(set100, set300), inter50);
      vennData.addIntersection(Set.of(set200, set300), inter100);
      expect(vennData.getSizeOf(set100, false)).toBe(25);
      expect(vennData.getSizeOf(set200, false)).toBe(75);
      expect(vennData.getSizeOf(set300, false)).toBe(150);
      expect(vennData.getSizeOf(inter25, false)).toBe(25);
      expect(vennData.getSizeOf(inter50, false)).toBe(50);
      expect(vennData.getSizeOf(inter100, false)).toBe(100);
    });

    it('should return the correct size of exclusive sets and intersections (3 2-circles inter, 1 3-circles inter)', () => {
      vennData.addSet(set100);
      vennData.addSet(set200);
      vennData.addSet(set300);
      vennData.addIntersection(Set.of(set100, set200), inter25);
      vennData.addIntersection(Set.of(set100, set300), inter50);
      vennData.addIntersection(Set.of(set200, set300), inter100);
      vennData.addIntersection(Set.of(set100, set200, set300), inter10);
      expect(vennData.getSizeOf(inter25, false)).toBe(15)
      expect(vennData.getSizeOf(inter50, false)).toBe(40)
      expect(vennData.getSizeOf(inter100, false)).toBe(90)
      expect(vennData.getSizeOf(set100, false)).toBe(35);
      expect(vennData.getSizeOf(set200, false)).toBe(85);
      expect(vennData.getSizeOf(set300, false)).toBe(160);
    });

  });

  describe('_testSet', () => {

    it('should throw if the `set` argument does not match the structure of a set', () => {
      let fakeSet = { size: 100 };
      expect(() => vennData._testSet(fakeSet)).toThrow();
    });

  });

});
