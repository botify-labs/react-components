import {OrderedSet, OrderedMap, Set, Map} from 'immutable';

class VennData {

  constructor(){
    this.sets = OrderedSet();
    this.intersections = OrderedMap();
  }

  addSet(set) {
    this._testSet(set);
    this.sets = this.sets.add(set);
  }

  addIntersection(sets, intersection) {
    if(!Set.isSet(sets)){
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

  getSizeOf(set, inclusive = false) {
    let size = set.get('size');

    if (!inclusive) {
      if (this.sets.contains(set)) {
        this.sets.forEach((other) => {
          if (other === set) {
            return;
          }
          let intersection = this.getIntersection(set, other);
          if (intersection === undefined) {
            return;
          }
          size -= intersection.get('size');
        });
      } else if (this.intersections.contains(set)) {
        let sets = this.intersections.findKey((other) => other === set);
        this.intersections.forEach((otherIntersection, otherSets) => {
          if (otherIntersection === set) {
            return;
          }
          if (otherSets.isSubset(sets)) {
            size -= otherIntersection.get('size');
          }
        });
      }
    }

    return size;
  }

  getSets() {
    return this.sets;
  }

  getIntersections() {
    return this.intersections;
  }

  getIntersection(set1, set2) {
    return this.intersections.get(Set.of(set1, set2));
  }

  _testSet(set){
    if(!Map.isMap(set)){
      throw new TypeError('Set is not an Map');
    }
  }

}

export default VennData;
