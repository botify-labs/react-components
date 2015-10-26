import {OrderedSet, OrderedMap, Set, Map} from 'immutable';

class VennData {

  constructor() {
    this.sets = OrderedSet();
    this.intersections = OrderedMap();
  }

  /**
   * Adds a VennSet to the list of sets
   * @param {VennSet} set
   */
  addSet(set) {
    this._testSet(set);
    this.sets = this.sets.add(set);
  }

  /**
   * Adds a VennIntersection to the list of intersections
   * @param {Set<VennSet>}      sets
   * @param {VennIntersection}  intersection  Intersection of `sets`
   */
  addIntersection(sets, intersection) {
    if (!Set.isSet(sets)) {
      throw new TypeError('sets argument is not a Set');
    }
    sets.forEach((set) => {
      if (!this.sets.contains(set)) {
        throw new Error('set does not exist');
      }
    });
    this._testSet(intersection);

    this.intersections = this.intersections.set(sets, intersection);
  }

  /**
   * Return the size of the given VennSet or VennIntersection
   * @param  {VennSet|VennIntersection} set
   * @param  {Boolean}                  inclusive
   * @return {Number}
   */
  getSizeOf(set, inclusive = false) {
    let size = set.get('size');

    if (!inclusive) {
      if (this.sets.contains(set)) {
        this.intersections.forEach((intersection, sets) => {
          if (sets.contains(set)) {
            size -= this.getSizeOf(intersection, false);
          }
        });
      } else if (this.intersections.contains(set)) {
        const sets = this.intersections.findKey((other) => other === set);
        this.intersections.forEach((otherIntersection, otherSets) => {
          if (otherIntersection !== set && sets.isSubset(otherSets)) {
            size -= this.getSizeOf(otherIntersection, false);
          }
        });
      }
    }

    return size;
  }

  /**
   * Return the list of sets as an ordered sequence
   * @return {IndexedSeq<VennSet>}
   */
  getSets() {
    return this.sets.valueSeq();
  }

  /**
   * Return the list of intersections as an ordered sequence of [Set<VennSet>, VennIntersection] tuples
   * @return {IndexedSeq<Array<Any>>}
   */
  getIntersections() {
    return this.intersections.entrySeq();
  }

  /**
   * Return the intersection of the given list of sets
   * @param  {Array<VennSet>} sets
   * @return {VennIntersection}
   */
  getIntersectionOf(...sets) {
    return this.intersections.get(Set.of(...sets));
  }

  _testSet(set) {
    if (!Map.isMap(set)) {
      throw new TypeError('Set is not an Map');
    }
  }

}

export default VennData;
