"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react/addons"));

var classNames = _interopRequire(require("classnames"));

var _ = _interopRequire(require("lodash"));

var PanelMenu = _interopRequire(require("./PanelMenu"));

require("font-awesome/css/font-awesome.css");

require("./Panel.scss");

var Panel = React.createClass({

  displayName: "Panel",

  propTypes: {
    className: React.PropTypes.string,
    defaultDisplayModeId: React.PropTypes.string,
    title: React.PropTypes.string, // Panel title
    displayModes: React.PropTypes.array,
    actions: React.PropTypes.array
  },

  getInitialState: function getInitialState() {
    return {
      currentDisplayModeId: this.props.defaultDisplayModeId
    };
  },

  /**
   * Called when a display mode is selected from the PanelMenu
   * Switches to the given display mode
   * @param {Object} displayMode
   */
  _handleDisplayMode: function _handleDisplayMode(displayMode) {
    this.setState({ currentDisplayModeId: displayMode.id });
  },

  /**
   * Called when an action is selected from the PanelMenu
   * Executes the given action
   * @param  {Object} action
   */
  _handleAction: function _handleAction(action) {
    action.callback();
  },

  render: function render() {
    var displayModes = this.props.displayModes;
    var actions = this.props.actions;

    var currentDisplayMode = _.find(displayModes, { id: this.state.currentDisplayModeId });

    return React.createElement(
      "div",
      { className: classNames(this.props.className, "Panel") },
      React.createElement(
        "div",
        { className: "Panel-header" },
        React.createElement(
          "div",
          { className: "Panel-titleWrapper" },
          React.createElement(
            "div",
            { className: "Panel-title", title: this.props.title },
            this.props.title
          )
        ),
        React.createElement(
          "div",
          { className: "Panel-actions" },
          React.createElement(PanelMenu, { currentDisplayModeId: this.state.currentDisplayModeId,
            displayModes: displayModes,
            actions: actions,
            onAction: this._handleAction,
            onDiplayMode: this._handleDisplayMode })
        )
      ),
      React.createElement(
        "div",
        { className: "Panel-body" },
        currentDisplayMode.render()
      )
    );
  }

});

module.exports = Panel;