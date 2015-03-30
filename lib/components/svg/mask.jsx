"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = _interopRequire(require("react"));

var _ = _interopRequire(require("lodash"));

var UniqueIdMixin = _interopRequire(require("./UniqueIdMixin"));

var Mask = React.createClass({
  displayName: "Mask",

  mixins: [UniqueIdMixin],

  render: function render() {
    var _props = this.props;
    var mask = _props.mask;
    var children = _props.children;
    var style = _props.style;

    var otherProps = _objectWithoutProperties(_props, ["mask", "children", "style"]);

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
        _extends({}, otherProps, { style: _extends({}, style, { mask: "url(#" + this._getId("mask") + ")" }) }),
        this.props.children
      )
    );
  }

});

module.exports = Mask;