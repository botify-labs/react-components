"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

var classNames = _interopRequire(require("classnames"));

var _reactBootstrap = require("react-bootstrap");

var DropdownButton = _reactBootstrap.DropdownButton;
var MenuItem = _reactBootstrap.MenuItem;

var PanelMenu = React.createClass({

  displayName: "PanelMenu",

  propTypes: {
    className: React.PropTypes.string,

    // Called when a display mode is selected
    onDisplayMode: React.PropTypes.func,

    // Called when an action is selected
    onAction: React.PropTypes.func,

    // Id of the current displayMode
    currentDisplayModeId: React.PropTypes.string,

    // Array of all available display modes
    // displayModes are retrieved from the getDisplayModes static method on Panel children
    displayModes: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      icon: React.PropTypes.string,
      label: React.PropTypes.string })),

    // Array of all available actions
    // actions are retrieved from the getAction static method on Panel children
    actions: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      icon: React.PropTypes.string,
      label: React.PropTypes.string,
      // Name of the method to call on the mounted component this action targets
      methodName: React.PropTypes.string })) },

  /**
   * Called when a display mode is selected
   * @param  {Object} displayMode
   */
  _handleDisplayModeSelect: function _handleDisplayModeSelect(displayMode) {
    if (this.props.onDisplayMode) {
      this.props.onDisplayMode(displayMode);
    }
  },

  /**
   * Called when an action is selected
   * @param  {Object} action
   */
  _handleActionSelect: function _handleActionSelect(action) {
    if (typeof this.props.onAction === "function") {
      this.props.onAction(action);
    }
  },

  render: function render() {
    var _this = this;

    var displayModes = this.props.displayModes.map(function (displayMode) {
      return React.createElement(
        MenuItem,
        { key: displayMode.id,
          className: displayMode.id === _this.props.currentDisplayModeId && "text-muted",
          onSelect: _this._handleDisplayModeSelect.bind(null, displayMode) },
        React.createElement("i", { className: "fa " + displayMode.icon }),
        displayMode.label
      );
    });

    var actions = this.props.actions.map(function (action) {
      return React.createElement(
        MenuItem,
        { key: action.id,
          onSelect: _this._handleActionSelect.bind(null, action) },
        React.createElement("i", { className: "fa " + action.icon }),
        action.label
      );
    });

    return React.createElement(
      DropdownButton,
      { noCaret: true,
        pullRight: true,
        className: classNames(this.props.className, "PanelMenu"),
        title: React.createElement("i", { className: "fa fa-gear" }) },
      displayModes,
      displayModes.length > 0 && actions.length > 0 ? React.createElement(MenuItem, { divider: true }) : null,
      actions
    );
  }

});

module.exports = PanelMenu;