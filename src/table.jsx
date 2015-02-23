import React from 'react';

var Table = React.createClass({

  displayName: 'Table',

  statics: {
    getDisplayModes() {
      return [{
        id: 'table',
        label: 'Display Table'
      }];
    },

    getActions() {
      return [{
        id: 'export table',
        methodName: 'exportTable',
        label: 'Export CSV'
      }];
    }
  },

  exportTable() {
    console.log('Exporting table!');
  },

  render() {
    return (
      <div>Table showing {this.props.displayMode}</div>
    );
  }

});

export default Table;