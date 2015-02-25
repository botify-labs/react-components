import React from 'react';

import Chart from './chart';

/**
 * Wrapper around google.visualization.LineChart
 * https://developers.google.com/chart/interactive/docs/gallery/linechart
 */
var LineChart = React.createClass({

  displayName: 'LineChart',

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

  // /**
  //  * Returns the Google DataTable to be passed as data to the child Chart
  //  * @return {Google.visualization.DataTable}
  //  */
  // _getDataTable() {
  //   var adapter = new this.props.adapterClass(this.props.chartData);

  //   return adapter.toGoogleDataArray();
  // },

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
      <Chart
        ref="chart"
        chart={google.visualization.ColumnChart}
        displayMode={this.props.displayMode}
        options={this._getOptions()}
        chartData={this.props.chartData}
      />
    );
  }

});

export default LineChart;