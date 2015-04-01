"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var React = _interopRequire(require("react"));

var VennLegend = React.createClass({

  displayName: "VennLegend",

  render: function render() {
    var _props = this.props;
    var vennData = _props.vennData;
    var onClick = _props.onClick;
    var onMouseOver = _props.onMouseOver;
    var onMouseOut = _props.onMouseOut;

    var sets = vennData.getSets();
    var intersections = vennData.getIntersections().map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var sets = _ref2[0];
      var intersection = _ref2[1];
      return intersection;
    });
    var elements = sets.concat(intersections).map(function (set, idx) {
      return React.createElement(
        "li",
        {
          key: idx,
          style: onClick && { cursor: "pointer" },
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