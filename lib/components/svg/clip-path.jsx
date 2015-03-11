"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = _interopRequire(require("react"));

var _ = _interopRequire(require("lodash"));

var UniqueIdMixin = _interopRequire(require("./unique-id-mixin"));

var ClipPath = React.createClass({
  displayName: "ClipPath",

  mixins: [UniqueIdMixin],

  componentDidMount: function componentDidMount() {
    this._setClipPath();
  },

  componentDidUpdate: function componentDidUpdate() {
    this._setClipPath();
  },

  _setClipPath: function _setClipPath() {
    this.refs.group.getDOMNode().setAttribute("clip-path", "url(#" + this._getId("clipPath") + ")");
  },

  render: function render() {
    return React.createElement(
      "g",
      null,
      React.createElement(
        "clipPath",
        { id: this._getId("clipPath") },
        this.props.path
      ),
      React.createElement(
        "g",
        _extends({ ref: "group" }, _.omit(this.props, "children", "path")),
        this.props.children
      )
    );
  }

});

module.exports = ClipPath;