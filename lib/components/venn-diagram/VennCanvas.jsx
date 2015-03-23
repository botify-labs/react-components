"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var React = _interopRequire(require("react"));

var venn = _interopRequire(require("venn.js"));

var _svgCircle = require("../svg/Circle");

var Circle = _interopRequire(_svgCircle);

var CircleDifference = _svgCircle.CircleDifference;
var CircleIntersection = _svgCircle.CircleIntersection;
var CircleDifferenceInterior = _svgCircle.CircleDifferenceInterior;
var CircleIntersectionInterior = _svgCircle.CircleIntersectionInterior;

var VennCanvas = React.createClass({

  displayName: "VennCanvas",

  getInitialState: function getInitialState() {
    return {
      width: 1000,
      height: 1000
    };
  },

  componentDidMount: function componentDidMount() {
    this._scale();

    // Re-scale the canvas whenever the window resizes
    window.addEventListener("resize", this._scale);
  },

  componentDidUpdate: function componentDidUpdate() {
    this._scale();
  },

  /**
   * Recalculate the venn diagram so that it fits into the canvas
   */
  _scale: function _scale() {
    var _getDOMNode = this.getDOMNode();

    var offsetWidth = _getDOMNode.offsetWidth;
    var offsetHeight = _getDOMNode.offsetHeight;

    if (offsetWidth !== this.state.width || offsetHeight !== this.state.height) {
      this.setState({ width: offsetWidth, height: offsetHeight });
    }
  },

  render: function render() {
    var _this = this;

    var _props = this.props;
    var vennData = _props.vennData;
    var inclusive = _props.inclusive;
    var onClick = _props.onClick;
    var onMouseOver = _props.onMouseOver;
    var onMouseOut = _props.onMouseOut;
    var _state = this.state;
    var width = _state.width;
    var height = _state.height;

    var padding = 30;

    var vennSets = vennData.getSets();
    var vennIntersections = vennData.getIntersections();

    // Transform our data into a structure venn.js understands
    var sets = vennSets.map(function (set, idx) {
      return {
        sets: [idx],
        size: set.get("size")
      };
    }).toJS();
    var intersections = vennIntersections.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var sets = _ref2[0];
      var intersection = _ref2[1];

      return {
        sets: sets.map(function (set) {
          return vennSets.indexOf(set);
        }).toJS(),
        size: intersection.get("size")
      };
    }).toJS();

    var circles = venn.venn(sets.concat(intersections));
    circles = venn.scaleSolution(circles, width, height, padding);

    // Create circle intersections and circle differences to represent our sets and set intersections.
    // Since sets and set intersections are extremely similar, they share a lot of code.
    // TODO: this part doesn't support cases where we have more than two sets or/and the diagram is inclusive
    // In order to support those cases display-wise we'd probably need to switch to a vector library more
    // powerful than standard SVG 1.1. Vector boolean operations are really hard to do in SVG 1.1, whereas
    // PaperJS has them built in.
    var setElements = vennSets.map(function (set, idx) {
      return {
        set: set,
        c1: circles[idx],
        c2: circles[1 - idx],
        "class": CircleDifference
      };
    });
    var interElements = vennIntersections.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var sets = _ref2[0];
      var intersection = _ref2[1];

      return {
        set: intersection,
        c1: circles[vennSets.indexOf(sets.first())],
        c2: circles[vennSets.indexOf(sets.last())],
        "class": CircleIntersection
      };
    });
    var elements = setElements.concat(interElements).map(function (el, idx) {
      return React.createElement(el["class"], {
        key: idx,
        style: onClick && { cursor: "pointer" },
        onClick: onClick && onClick.bind(null, el.set, idx),
        onMouseOver: onMouseOver && onMouseOver.bind(null, el.set),
        onMouseOut: onMouseOut && onMouseOut.bind(null, el.set),
        c1: el.c1,
        c2: el.c2,
        fill: el.set.get("color"),
        opacity: el.set === _this.props.activeSet ? 1 : 0.8
      });
    }).toJS();

    return React.createElement(
      "svg",
      { className: "VennCanvas" },
      elements
    );
  }

});

module.exports = VennCanvas;