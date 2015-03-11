"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

var VennLegend = React.createClass({

  displayName: "VennLegend",

  render: function render() {
    var _props = this.props;
    var vennData = _props.vennData;
    var activeSet = _props.activeSet;
    var onClick = _props.onClick;
    var onMouseOver = _props.onMouseOver;
    var onMouseOut = _props.onMouseOut;

    var sets = vennData.getSets();
    var intersections = vennData.getIntersections().valueSeq();
    var elements = sets.concat(intersections).map(function (set, idx) {
      return React.createElement(
        "li",
        {
          key: idx,
          onClick: onClick && onClick.bind(null, set, idx),
          onMouseOver: onMouseOver && onMouseOver.bind(null, set),
          onMouseOut: onMouseOut && onMouseOut.bind(null, set)
        },
        React.createElement("div", {
          className: "VennLegend-square",
          style: { backgroundColor: set.get("color") }
        }),
        set.get("label")
      );
    }).toJS();

    return React.createElement(
      "ul",
      { className: "VennLegend" },
      elements
    );
  }

});

module.exports = VennLegend;