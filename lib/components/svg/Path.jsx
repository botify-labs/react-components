"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = _interopRequire(require("react"));

var _ = _interopRequire(require("lodash"));

var dim = 10000;
var fullShape = ["M " + -dim + " " + -dim, "L " + dim + " " + -dim, "L " + dim + " " + dim, "L " + -dim + " " + dim, "Z"].join(" ");

var Path = React.createClass({

  displayName: "Path",

  propTypes: {
    // Is this an inversed shape?
    inverse: React.PropTypes.bool
  },

  render: function render() {
    var _props = this.props;
    var d = _props.d;
    var inverse = _props.inverse;
    var _props$style = _props.style;
    var style = _props$style === undefined ? {} : _props$style;

    var otherProps = _objectWithoutProperties(_props, ["d", "inverse", "style"]);

    if (inverse) {
      d = fullShape + d;
      style.fillRule = "evenodd";
    }

    return React.createElement("path", _extends({}, otherProps, { d: d, style: style }));
  }

});

module.exports = Path;