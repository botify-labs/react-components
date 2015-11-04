import React from 'react';

import GoogleChart from './GoogleChart';

/**
 * Wrapper around google.visualization.ColumnChart
 * https://developers.google.com/chart/interactive/docs/gallery/columnchart
 */
const GoogleColumnChart = React.createClass({

  displayName: 'GoogleColumnChart',

  getImageURI() {
    return this.refs.chart.getImageURI();
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
        width: '60%',
        height: '80%',
      },
      fontSize: 14,
    };
  },

  render() {
    return (
      <GoogleChart
        {...this.props}
        ref="chart"
        googleChart={google.visualization.ColumnChart}
        options={this._getOptions()}
      />
    );
  },

});

export default GoogleColumnChart;
