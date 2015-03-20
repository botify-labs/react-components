"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = _interopRequire(require("react"));

var _ = _interopRequire(require("lodash"));

var UniqueIdMixin = _interopRequire(require("./UniqueIdMixin"));

var Mask = React.createClass({
  displayName: "Mask",

  mixins: [UniqueIdMixin],

  componentDidMount: function componentDidMount() {
    this._setMask();
  },

  componentDidUpdate: function componentDidUpdate() {
    this._setMask();
  },

  _setMask: function _setMask() {
    this.refs.group.getDOMNode().setAttribute("mask", "url(#" + this._getId("mask") + ")");
  },

  render: function render() {
    return React.createElement(
      "g",
      null,
      React.createElement(
        "mask",
        { id: this._getId("mask") },
        this.props.mask
      ),
      React.createElement(
        "g",
        _extends({ ref: "group" }, _.omit(this.props, "children", "mask")),
        this.props.children
      )
    );
  }

});

module.exports = Mask;