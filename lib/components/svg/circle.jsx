"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var React = _interopRequire(require("react"));

var _ = _interopRequire(require("lodash"));

var Path = _interopRequire(require("./Path"));

var Mask = _interopRequire(require("./Mask"));

var ClipPath = _interopRequire(require("./ClipPath"));

var Circle = React.createClass({

  displayName: "Circle",

  propTypes: {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    radius: React.PropTypes.number.isRequired },

  render: function render() {
    return React.createElement(Path, _extends({ d: this._getCircleShape() }, _.omit(this.props, "x", "y", "radius")));
  },

  _getCircleShape: function _getCircleShape() {
    var _props = this.props;
    var x = _props.x;
    var y = _props.y;
    var radius = _props.radius;

    return ["M " + x + " " + y, "m " + -radius + ", 0", "a " + radius + "," + radius + " 0 1,0 " + radius * 2 + ",0", "a " + radius + "," + radius + " 0 1,0 " + -radius * 2 + ",0", "Z"].join(" ");
  } });

var CircleIntersection = React.createClass({

  displayName: "CircleIntersection",

  propTypes: {
    c1: React.PropTypes.object.isRequired,
    c2: React.PropTypes.object.isRequired,
    fill: React.PropTypes.string },

  render: function render() {
    var _props = this.props;
    var c1 = _props.c1;
    var c2 = _props.c2;
    var fill = _props.fill;

    var clipPath = React.createElement(Circle, c2);

    return React.createElement(
      ClipPath,
      _extends({ path: clipPath }, _.omit(this.props, "fill", "c1", "c2")),
      React.createElement(Circle, _extends({ fill: fill }, c1))
    );
  }

});

var CircleDifference = React.createClass({

  displayName: "CircleDifference",

  propTypes: {
    c1: React.PropTypes.object.isRequired,
    c2: React.PropTypes.object.isRequired,
    fill: React.PropTypes.string },

  render: function render() {
    var _props = this.props;
    var c1 = _props.c1;
    var c2 = _props.c2;
    var fill = _props.fill;

    var clipPath = React.createElement(Circle, _extends({ inverse: true }, c2));

    return React.createElement(
      ClipPath,
      _extends({ path: clipPath }, _.omit(this.props, "fill", "c1", "c2")),
      React.createElement(Circle, _extends({ fill: fill }, c1))
    );
  }

});

var CircleIntersectionStroke = React.createClass({

  displayName: "CircleIntersectionStroke",

  propTypes: {
    c1: React.PropTypes.object.isRequired,
    c2: React.PropTypes.object.isRequired,
    width: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string },

  render: function render() {
    var _props = this.props;
    var c1 = _props.c1;
    var c2 = _props.c2;
    var width = _props.width;
    var fill = _props.fill;

    var mask = React.createElement(
      "g",
      null,
      React.createElement(CircleIntersection, {
        c1: c1,
        c2: c2,
        fill: "white"
      }),
      React.createElement(CircleIntersection, {
        c1: _.assign({}, c1, {
          radius: c1.radius - width
        }),
        c2: _.assign({}, c2, {
          radius: c2.radius - width
        }),
        fill: "black"
      })
    );

    return React.createElement(
      Mask,
      _extends({ style: { pointerEvents: "none" }, mask: mask }, _.omit(this.props, "fill", "c1", "c2")),
      React.createElement("rect", { width: "100%", height: "100%", fill: fill })
    );
  }

});

var CircleDifferenceStroke = React.createClass({

  displayName: "CircleDifferenceStroke",

  propTypes: {
    c1: React.PropTypes.object.isRequired,
    c2: React.PropTypes.object.isRequired,
    width: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string },

  render: function render() {
    var _props = this.props;
    var c1 = _props.c1;
    var c2 = _props.c2;
    var width = _props.width;
    var fill = _props.fill;

    var mask = React.createElement(
      "g",
      null,
      React.createElement(CircleDifference, {
        c1: c1,
        c2: c2,
        fill: "white"
      }),
      React.createElement(CircleDifference, {
        c1: _.assign({}, c1, {
          radius: c1.radius - width
        }),
        c2: _.assign({}, c2, {
          radius: c2.radius + width
        }),
        fill: "black"
      })
    );

    return React.createElement(
      Mask,
      _extends({ style: { pointerEvents: "none" }, mask: mask }, _.omit(this.props, "fill", "c1", "c2")),
      React.createElement("rect", { width: "100%", height: "100%", fill: fill })
    );
  }

});

var CircleDifferenceInterior = React.createClass({

  displayName: "CircleDifferenceInterior",

  propTypes: {
    c1: React.PropTypes.object.isRequired,
    c2: React.PropTypes.object.isRequired,
    width: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string },

  render: function render() {
    var _props = this.props;
    var c1 = _props.c1;
    var c2 = _props.c2;
    var width = _props.width;
    var fill = _props.fill;

    return React.createElement(CircleDifference, _extends({
      c1: _.assign({}, c1, {
        radius: c1.radius - width
      }),
      c2: _.assign({}, c2, {
        radius: c2.radius + width
      }),
      fill: fill,
      style: { pointerEvents: "none" }
    }, _.omit(this.props, "fill", "width", "c1", "c2")));
  }

});

var CircleIntersectionInterior = React.createClass({

  displayName: "CircleIntersectionInterior",

  propTypes: {
    c1: React.PropTypes.object.isRequired,
    c2: React.PropTypes.object.isRequired,
    width: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string },

  render: function render() {
    var _props = this.props;
    var c1 = _props.c1;
    var c2 = _props.c2;
    var width = _props.width;
    var fill = _props.fill;

    return React.createElement(CircleIntersection, _extends({
      c1: _.assign({}, c1, {
        radius: c1.radius - width
      }),
      c2: _.assign({}, c2, {
        radius: c2.radius - width
      }),
      fill: fill,
      style: { pointerEvents: "none" }
    }, _.omit(this.props, "fill", "width", "c1", "c2")));
  }

});

exports["default"] = Circle;
exports.CircleIntersection = CircleIntersection;
exports.CircleDifference = CircleDifference;
exports.CircleIntersectionStroke = CircleIntersectionStroke;
exports.CircleDifferenceStroke = CircleDifferenceStroke;
exports.CircleIntersectionInterior = CircleIntersectionInterior;
exports.CircleDifferenceInterior = CircleDifferenceInterior;