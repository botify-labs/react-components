"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _react = require("react");

var React = _interopRequire(_react);

var PropTypes = _react.PropTypes;

var _reactBootstrap = require("react-bootstrap");

var DropdownButton = _reactBootstrap.DropdownButton;
var MenuItem = _reactBootstrap.MenuItem;

var classNames = _interopRequire(require("classnames"));

require("./AdminMenu.scss");

var AdminMenu = React.createClass({

  displayName: "AdminMenu",

  propTypes: {
    className: PropTypes.string,
    resourceText: PropTypes.shape({
      text: PropTypes.string,
      description: PropTypes.string,
      editUrl: PropTypes.string }).isRequired },

  render: function render() {
    var title = React.createElement("i", { className: "fa fa-puzzle-piece" });
    return React.createElement(
      DropdownButton,
      { className: classNames(this.props.className, "AdminMenu", "transparent"),
        title: title, noCaret: true },
      React.createElement(
        MenuItem,
        { eventKey: "1", href: this.props.resourceText.editUrl },
        React.createElement("i", { className: "MenuItem-icon fa fa-pencil-square-o" }),
        "Edit Text"
      )
    );
  }

});

module.exports = AdminMenu;