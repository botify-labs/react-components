import React from 'react';

import Chart from './chart';

/**
 * Wrapper around google.visualization.PieChart
 * https://developers.google.com/chart/interactive/docs/gallery/piechart
 */
var PieChart = React.createClass({

  displayName: 'PieChart',

  statics: {
    getDefaultDisplayModeId() {
      return 'chart';
    },

    getDisplayModes() {
      return [{
        id: 'chart',
        label: 'Display Chart'
      }, {
        id: 'percentage',
        label: 'Display Chart (percentage)'
      }];
    },

    getActions() {
      return [{
        id: 'export chart',
        label: 'Export PNG',
        methodName: 'exportChart'
      }];
    }
  },

  exportChart() {
    this.refs['chart'].exportChart();
  },

  /**
   * Returns the Google DataTable to be passed as data to the child Chart
   * @return {Google.visualization.DataTable}
   */
  _getDataTable() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
      ['Mushrooms', 3],
      ['Onions', 1],
      ['Olives', 1],
      ['Zucchini', 1],
      ['Pepperoni', 2]
    ]);

    return data;
  },

  /**
   * Returns the options to be passed to the child Chart
   * @return {Object}
   */
  _getOptions() {
    return {
      legend: {
          position: 'right',
          alignment: 'center',
      },
      chartArea: {
          width: '90%',
          height: '80%',
          top: this.props.subInfo ? 35 : 'auto'
      },
      fontSize: 14
    };
  },

  render() {
    return (
      <Chart ref="chart" chart={google.visualization.PieChart} options={this._getOptions()} data={this._getDataTable()} />
    );
  }

});

export default PieChart;