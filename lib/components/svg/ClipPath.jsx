"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = _interopRequire(require("react"));

var _ = _interopRequire(require("lodash"));

var UniqueIdMixin = _interopRequire(require("./UniqueIdMixin"));

var ClipPath = React.createClass({

  displayName: "ClipPath",

  mixins: [UniqueIdMixin],

  propTypes: {
    // Shape used to clip the ClipPath's children
    path: React.PropTypes.element
  },

  render: function render() {
    var _props = this.props;
    var path = _props.path;
    var children = _props.children;
    var style = _props.style;

    var otherProps = _objectWithoutProperties(_props, ["path", "children", "style"]);

    return React.createElement(
      "g",
      null,
      React.createElement(
        "clipPath",
        { id: this._getId("clipPath") },
        path
      ),
      React.createElement(
        "g",
        _extends({}, otherProps, { style: _extends({}, style, { clipPath: "url(#" + this._getId("clipPath") + ")" }) }),
        children
      )
    );
  }

});

module.exports = ClipPath;