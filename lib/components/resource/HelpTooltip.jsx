"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _react = require("react");

var React = _interopRequire(_react);

var PropTypes = _react.PropTypes;

var _reactBootstrap = require("react-bootstrap");

var OverlayTrigger = _reactBootstrap.OverlayTrigger;
var Tooltip = _reactBootstrap.Tooltip;

var classNames = _interopRequire(require("classnames"));

var HelpTooltip = React.createClass({

  displayName: "HelpTooltip",

  propTypes: {
    className: PropTypes.string },

  render: function render() {
    var tooltip = React.createElement(
      Tooltip,
      null,
      this.props.children
    );

    return (
      //@TODO tooltip trigger should be hover and should stayed visible when user mouse is over the tooltip.
      React.createElement(
        OverlayTrigger,
        { trigger: "click", placement: "top", overlay: tooltip, delayShow: 0, delayHide: 1000 },
        React.createElement("i", { className: classNames(this.props.className, "fa fa-question-circle") })
      )
    );
  }

});

module.exports = HelpTooltip;