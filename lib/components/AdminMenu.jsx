"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

// ApiRequestsModal
// <div class="modal fade admin-modal" id="modal-{{id}}" tabindex="-1" role="dialog"
//      aria-labelledby="modalLabel-{{id}}" aria-hidden="true">
//   <div class="modal-dialog">
//     <div class="modal-content">
//       <div class="modal-header">
//         <button type="button" class="close" data-dismiss="modal">
//           <span aria-hidden="true">&times;</span>
//           <span class="sr-only">Close</span>
//         </button>
//         <h4 class="modal-title" id="modalLabel-{{id}}">Chart {{id}} - API Requests List</h4>
//       </div>
//       <div class="modal-body">
//         <table class="table requests-list">
//           <thead>
//             <tr><th> Type </th><th> Request </th></tr>
//           </thead>
//           <tbody>
//           {{#each requests_list}}
//             <tr><td> {{type}} </td><td class="text-overflow"> {{request}} </td></tr>
//           {{/each}}
//           <tbody>
//         </table>
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
//       </div>
//     </div>
//   </div>

var AdminMenu = React.createClass({

  displayName: "AdminMenu",

  render: function render() {
    return React.createElement("div", null);
    var editHelpText = React.createElement(
      "li",
      null,
      React.createElement(
        "a",
        { className: React.addons.classSet({
            "help-text-admin": true,
            edit: !!this.props.helpText,
            noscript: true
          }),
          href: this.props.helpText ? this.props.editHelpTextUrl : this.props.addHelpTextUrl },
        React.createElement("i", { "class": "fa fa-pencil-square-o" }),
        "Edit text"
      )
    );

    // TODO: maybe pass a query array to Panel, which then passes it to this element, which then
    // shows api requests in a modal
    var showApiRequests = React.createElement(
      "li",
      null,
      React.createElement(
        "span",
        null,
        React.createElement("i", { "class": "fa fa-ellipsis-h" }),
        "Show API Requests"
      )
    );

    return React.createElement(
      "div",
      { "class": "btn-group admin-menu" },
      React.createElement(
        "button",
        { type: "button", "class": "btn btn-xs btn-icon btn-circle dropdown-toggle", "data-toggle": "dropdown", title: "Admin" },
        React.createElement("i", { "class": "fa fa-puzzle-piece" })
      ),
      React.createElement(
        "ul",
        { "class": "dropdown-menu", role: "menu" },
        editHelpText,
        showApiRequests
      )
    );
  }

});

module.exports = AdminMenu;