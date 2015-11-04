import React from 'react';
import ReactDOM from 'react-dom';
import 'datatables';
import $ from 'jquery';

import ChartData from '../models/ChartData';

import 'datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.css';
import 'datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.js';

const Table = React.createClass({

  displayName: 'Table',

  propTypes: {
    chartData: React.PropTypes.instanceOf(ChartData),
  },

  statics: {
    getDefaultDisplayModeId() {
      return 'table';
    },

    getDisplayModes() {
      return [
        {
          id: 'table',
          label: 'Display Table',
        },
      ];
    },

    getActions() {
      return [
        {
          id: 'export table',
          methodName: 'exportTable',
          label: 'Export CSV',
        },
      ];
    },
  },

  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).dataTable(this._getOptions());
  },

  exportTable() {
  },

  _getData() {
    return this.props.chartData.rawData.entrySeq().map(([dataKeys, dataValues]) => {
      const groups = dataKeys.entrySeq().map(([dimKey, groupKey]) => {
        const group = this.props.chartData.getDimensionGroup(dimKey, groupKey);
        return group.get('label');
      });

      const metrics = dataValues.map((value, index) => {
        const metric = this.props.chartData.getMetric(index);
        return metric.get('render')(value);
      });

      return groups.concat(metrics);
    }).toJS();
  },

  _getColumns() {
    const dimensions = this.props.chartData.dimensions.entrySeq().map(([dimensionKey, dimensionMetadata]) => {
      return {
        title: dimensionMetadata.get('label'),
      };
    });

    const metrics = this.props.chartData.metrics.map((metric) => {
      return {
        title: metric.get('label'),
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
      },
    };
  },

  render() {
    return (
      <div className="Table">
        <table ref="table" className="table table-striped table-bordered dataTable no-footer">
        </table>
      </div>
    );
  },

});

export default Table;
