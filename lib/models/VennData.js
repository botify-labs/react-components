"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _immutable = require("immutable");

var OrderedSet = _immutable.OrderedSet;
var OrderedMap = _immutable.OrderedMap;
var Set = _immutable.Set;
var Map = _immutable.Map;

var VennData = (function () {
  function VennData() {
    _classCallCheck(this, VennData);

    this.sets = OrderedSet();
    this.intersections = OrderedMap();
  }

  _prototypeProperties(VennData, null, {
    addSet: {

      /**
       * Adds a VennSet to the list of sets
       * @param {VennSet} set
       */

      value: function addSet(set) {
        this._testSet(set);
        this.sets = this.sets.add(set);
      },
      writable: true,
      configurable: true
    },
    addIntersection: {

      /**
       * Adds a VennIntersection to the list of intersections
       * @param {Set<VennSet>}      sets
       * @param {VennIntersection}  intersection  Intersection of `sets`
       */

      value: function addIntersection(sets, intersection) {
        var _this = this;

        if (!Set.isSet(sets)) {
          throw new TypeError("sets argument is not a Set");
        }
        sets.forEach(function (set) {
          if (!_this.sets.contains(set)) {
            throw new Error("set does not exist");
          }
        });
        this._testSet(intersection);

        this.intersections = this.intersections.set(sets, intersection);
      },
      writable: true,
      configurable: true
    },
    getSizeOf: {

      /**
       * Return the size of the given VennSet or VennIntersection
       * @param  {VennSet|VennIntersection} set
       * @param  {Boolean}                  inclusive
       * @return {Number}
       */

      value: function getSizeOf(set) {
        var _this = this;

        var inclusive = arguments[1] === undefined ? false : arguments[1];

        var size = set.get("size");

        if (!inclusive) {
          if (this.sets.contains(set)) {
            this.sets.forEach(function (other) {
              if (other === set) {
                return;
              }
              var intersection = _this.getIntersectionOf(set, other);
              if (intersection === undefined) {
                return;
              }
              size -= _this.getSizeOf(intersection, false);
            });
          } else if (this.intersections.contains(set)) {
            (function () {
              var sets = _this.intersections.findKey(function (other) {
                return other === set;
              });
              _this.intersections.forEach(function (otherIntersection, otherSets) {
                if (otherIntersection === set) {
                  return;
                }
                if (otherSets.isSubset(sets)) {
                  size -= _this.getSizeOf(otherIntersection, false);
                }
              });
            })();
          }
        }

        return size;
      },
      writable: true,
      configurable: true
    },
    getSets: {

      /**
       * Return the list of sets as an ordered sequence
       * @return {IndexedSeq<VennSet>}
       */

      value: function getSets() {
        return this.sets.valueSeq();
      },
      writable: true,
      configurable: true
    },
    getIntersections: {

      /**
       * Return the list of intersections as an ordered sequence of [Set<VennSet>, VennIntersection] tuples
       * @return {IndexedSeq<Array<Any>>}
       */

      value: function getIntersections() {
        return this.intersections.entrySeq();
      },
      writable: true,
      configurable: true
    },
    getIntersectionOf: {

      /**
       * Return the intersection of the given list of sets
       * @param  {Array<VennSet>} sets
       * @return {VennIntersection}
       */

      value: function getIntersectionOf() {
        for (var _len = arguments.length, sets = Array(_len), _key = 0; _key < _len; _key++) {
          sets[_key] = arguments[_key];
        }

        return this.intersections.get(Set.of.apply(Set, sets));
      },
      writable: true,
      configurable: true
    },
    _testSet: {
      value: function _testSet(set) {
        if (!Map.isMap(set)) {
          throw new TypeError("Set is not an Map");
        }
      },
      writable: true,
      configurable: true
    }
  });

  return VennData;
})();

module.exports = VennData;
//# sourceMappingURL=../models/VennData.js.map