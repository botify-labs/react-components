"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = _interopRequire(require("react"));

var _ = _interopRequire(require("lodash"));

var dim = 10000;
var fullShape = ["M " + -dim + " " + -dim, "L " + dim + " " + -dim, "L " + dim + " " + dim, "L " + -dim + " " + dim, "Z"].join(" ");

var Path = React.createClass({
  displayName: "Path",

  componentDidMount: function componentDidMount() {
    if (this.props.inverse) {
      this._setFillRule();
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    if (this.props.inverse) {
      this._setFillRule();
    }
  },

  _setFillRule: function _setFillRule() {
    this.getDOMNode().setAttribute("fill-rule", "evenodd");
  },

  render: function render() {
    var _props = this.props;
    var d = _props.d;
    var inverse = _props.inverse;

    if (inverse) {
      d = fullShape + d;
    }

    return React.createElement("path", _extends({ d: d }, _.omit(this.props, "d", "inverse")));
  }

});

module.exports = Path;