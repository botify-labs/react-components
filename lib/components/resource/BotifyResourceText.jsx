"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
"use strict";

var _react = require("react");

var React = _interopRequire(_react);

var PropTypes = _react.PropTypes;

var ResourceText = _interopRequire(require("./ResourceText"));

var url = _interopRequire(require("url"));

var BotifyResourceTextFormatter = React.createClass({

  displayName: "BotifyResourceTextFormatter",

  propTypes: {
    id: PropTypes.string.isRequired, //used to create helper if doesn't exist
    component: PropTypes.func.isRequired,
    resourceText: PropTypes.shape({
      defaultText: PropTypes.string,
      text: PropTypes.string,
      defaultDescription: PropTypes.string,
      description: PropTypes.string,
      addUrl: PropTypes.string,
      editUrl: PropTypes.string }).isRequired },

  render: function render() {
    var _props = this.props;
    var id = _props.id;
    var Component = _props.component;
    var _props$resourceText = _props.resourceText;
    var defaultText = _props$resourceText.defaultText;
    var text = _props$resourceText.text;
    var defaultDescription = _props$resourceText.defaultDescription;
    var description = _props$resourceText.description;
    var addUrl = _props$resourceText.addUrl;
    var editUrl = _props$resourceText.editUrl;

    var otherProps = _objectWithoutProperties(_props, ["id", "component", "resourceText"]);

    var resourceText = {
      text: text || defaultText,
      description: description || defaultDescription,
      editUrl: editUrl || addUrl ? url.resolve(addUrl, id) : undefined
    };

    return React.createElement(Component, _extends({}, otherProps, {
      resourceText: resourceText
    }));
  }

});

var BotifyResourceText = React.createClass({

  displayName: "BotifyResourceText",

  propTypes: {
    id: PropTypes.string,
    resourceText: PropTypes.shape({
      defaultText: PropTypes.string,
      text: PropTypes.string,
      defaultDescription: PropTypes.string,
      description: PropTypes.string,
      addUrl: PropTypes.string,
      editUrl: PropTypes.string }).isRequired,
    isAdmin: PropTypes.bool },

  render: function render() {
    return React.createElement(BotifyResourceTextFormatter, _extends({}, this.props, {
      component: ResourceText
    }));
  }

});

exports["default"] = BotifyResourceText;
exports.BotifyResourceTextFormatter = BotifyResourceTextFormatter;