import React from 'react';
// Datatables tries to require jQuery
import DataTable from 'imports?define=>false,exports=>false!datatables';

import '../vendors/datatables-bootstrap/dataTables.bootstrap.css';
// Datatables bootstrap integration tries to require jQuery too
import 'imports?define=>false,exports=>false!../vendors/datatables-bootstrap/dataTables.bootstrap.js';

var Table = React.createClass({

  displayName: 'Table',

  statics: {
    getDefaultDisplayModeId() {
      return 'table';
    },

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

  componentDidMount() {
    $(this.refs['table'].getDOMNode()).dataTable(this._getOptions());
  },

  render() {
    return (
      <div className="Table">
        <table ref="table" className="table table-striped table-bordered dataTable no-footer">
        </table>
      </div>
    );
  },

  _getData() {
    return this.props.chartData.rawData.entrySeq().map(([dataKeys, dataValues]) => {
      var groups = dataKeys.entrySeq().map(([dimKey, groupKey]) => {
        var group = this.props.chartData.getDimensionGroup(dimKey, groupKey);
        return group.get('label');
      });

      var metrics = dataValues.map((value, index) => {
        var metric = this.props.chartData.getMetric(index);
        return metric.get('render')(value);
      });

      return groups.concat(metrics);
    }).toJS();
  },

  _getColumns() {
    var dimensions = this.props.chartData.dimensions.entrySeq().map(([dimensionKey, dimensionMetadata]) => {
      return {
        title: dimensionMetadata.get('label')
      };
    });

    var metrics = this.props.chartData.metrics.map((metric) => {
      return {
        title: metric.get('label')
      };
    });

    return dimensions.concat(metrics).toJS();
  },

  _getOptions() {
    return {
      data: this._getData(),
      columns: this._getColumns(),
      paging: false,
      searching: false,
      info: false,
      drawCallback: () => {
        this.forceUpdate();
      }
    };
  }

});

export default Table;