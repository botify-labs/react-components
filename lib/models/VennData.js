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
      value: function addSet(set) {
        this._testSet(set);
        this.sets = this.sets.add(set);
      },
      writable: true,
      configurable: true
    },
    addIntersection: {
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
              var intersection = _this.getIntersection(set, other);
              if (intersection === undefined) {
                return;
              }
              size -= intersection.get("size");
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
                  size -= otherIntersection.get("size");
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
      value: function getSets() {
        return this.sets;
      },
      writable: true,
      configurable: true
    },
    getIntersections: {
      value: function getIntersections() {
        return this.intersections;
      },
      writable: true,
      configurable: true
    },
    getIntersection: {
      value: function getIntersection(set1, set2) {
        return this.intersections.get(Set.of(set1, set2));
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