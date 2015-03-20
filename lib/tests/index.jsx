"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

// buildErrorTree = (inst) ->
//   tree =
//     inst: inst
//     displayName: inst._currentElement.type.displayName
//     props: inst._currentElement._store.props
//     parent:
//       if inst._currentElement._owner?
//         buildErrorTree inst._currentElement._owner
//       else
//         null

//   return tree

// createElement = React.createElement
// React.createElement = ->
//   element = createElement.apply React, arguments

//   for fnName in ['render']
//     fn = element.type.prototype[fnName]
//     element.type.prototype[fnName] = ->
//       try
//         return (fn.apply this, arguments)
//       catch e
//         tree = buildErrorTree this._reactInternalInstance
//         return DOM.div null, 'ERROR HAPPENED WHAAAAT'
//   return element

var React = _interopRequire(require("react"));

var SpecificPanelController = _interopRequire(require("./SpecificPanelController"));

google.load("visualization", "1.0", { packages: ["corechart"] });

google.setOnLoadCallback(function () {
  React.render(React.createElement(SpecificPanelController, null), document.getElementById("container"));
});