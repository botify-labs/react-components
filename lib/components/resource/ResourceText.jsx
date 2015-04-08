"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var React = _interopRequire(_react);

var PropTypes = _react.PropTypes;

var HelpTooltip = _interopRequire(require("./HelpTooltip"));

var AdminMenu = _interopRequire(require("./AdminMenu"));

var classNames = _interopRequire(require("classnames"));

require("./ResourceText.scss");

var ResourceText = React.createClass({

  displayName: "ResourceText",

  propTypes: {
    className: PropTypes.string,
    resourceText: PropTypes.shape({
      text: PropTypes.string,
      description: PropTypes.string,
      editUrl: PropTypes.string }).isRequired,
    isAdmin: PropTypes.bool },

  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var resourceText = _props.resourceText;
    var isAdmin = _props.isAdmin;

    var otherProps = _objectWithoutProperties(_props, ["className", "resourceText", "isAdmin"]);

    return React.createElement(
      "div",
      _extends({ className: classNames(className, "ResourceText") }, otherProps),
      resourceText.text && React.createElement(
        "span",
        { className: "ResourceText-text" },
        resourceText.text
      ),
      resourceText.description && React.createElement(
        HelpTooltip,
        { className: "ResourceText-helpTooltip" },
        React.createElement("span", { dangerouslySetInnerHTML: { __html: resourceText.description } })
      ),
      isAdmin && React.createElement(AdminMenu, { className: "ResourceText-adminMenu",
        resourceText: resourceText })
    );
  }

});

module.exports = ResourceText;