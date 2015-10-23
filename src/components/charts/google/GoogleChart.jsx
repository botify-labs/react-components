import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import ChartData from '../../../models/ChartData';
import ChartDataGoogleDataAdapter from '../../../adapters/ChartDataGoogleDataAdapter';

/**
 * Wrapper around a generic Google Chart
 * TODO: Maybe use a mixin instead?
 * Something like ChartMixin({
 *   chart: google.visualization.PieChart
 * })
 */
let GoogleChart = React.createClass({

  displayName: 'GoogleChart',

  propTypes: {
    // Called when chart data is selected
    onChartSelect: React.PropTypes.func,
    // Called when chart data is hovered
    onChartMouseOver: React.PropTypes.func,
    // Called when chart data is not hovered anymore
    onChartMouseOut: React.PropTypes.func,
    // Subclass of google.visualization.CoreChart
    googleChart: React.PropTypes.func,
    // Chart data
    chartData: React.PropTypes.instanceOf(ChartData),
    // Chart options
    // TODO: define structure
    options: React.PropTypes.object,
  },

  componentDidMount() {
    this._initializeChart();

    // Redraw the chart whenever the window is resized
    window.addEventListener('resize', this._drawChart);
  },

  shouldComponentUpdate(nextProps, nextState) {
    // TODO: use immutable!
    return !(nextProps.chartData === this.props.chartData);
  },

  componentDidUpdate(prevProps, prevState) {
    this._drawChart();
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._drawChart);
  },

  /**
   * Instanciates the Google Chart from the chart constructor prop.
   * This should only be called once.
   */
  _initializeChart() {
    this.adapter = new ChartDataGoogleDataAdapter(this.props.chartData);

    this.chart = new this.props.googleChart(ReactDOM.findDOMNode(this));

    this._bindChartEvents();
    this._drawChart();
  },

  /**
   * Binds event handlers to chart events
   */
  _bindChartEvents() {
    google.visualization.events.addListener(this.chart, 'onmousemove', this._handleChartMouseMove);
    google.visualization.events.addListener(this.chart, 'select', this._handleChartSelect);
    google.visualization.events.addListener(this.chart, 'onmouseover', this._handleChartMouseOver);
    google.visualization.events.addListener(this.chart, 'onmouseout', this._handleChartMouseOut);
  },

  /**
   * Returns the google chart options
   * @return {Object}
   */
  _getOptions() {
    return {
      tooltip: {
        trigger: 'none',
      },
      ...this.adapter.toGoogleOptions(),
      ...this.props.options,
    };
  },

  /**
   * Redraws the chart with data and options props.
   */
  _drawChart() {
    this.chart.draw(this.adapter.toGoogleDataArray(), this._getOptions());
  },

  /**
   * Returns underlying chart's image URI representation
   * @return {String}
   */
  getImageURI() {
    return this.chart.getImageURI();
  },

  /**
   * Called when the mouse moves over the chart
   * Keeps track of what element the mouse is currently hovering
   * @param {Event} e
   */
  _handleChartMouseMove(e) {
    this._prevTargetID = this._targetID;
    this._targetID = e.targetID;
  },

  /**
   * Called when a chart data point or category is selected
   * @param {Event} e
   */
  _handleChartSelect(e) {
    if (!this.props.onChartSelect) {
      return;
    }

    let filter = this.adapter.selectionToDataKeys(e);
    let data = this.props.chartData.filterData(filter);

    this.props.onChartSelect(data);
  },

  /**
   * Called when the mouse enters a chart data point
   * @param {Event} e
   */
  _handleChartMouseOver(e) {
    if (!this.props.onChartMouseOver || this._targetID.indexOf('legendentry') === 0) {
      // Don't execute mouseOver when the hovered element is the legend
      return;
    }

    let filter = this.adapter.selectionToDataKeys(e);
    let data = this.props.chartData.filterData(filter);

    this.props.onChartMouseOver(data);
  },

  /**
   * Called when the mouse leaves a chart data point
   */
  _handleChartMouseOut() {
    if (!this.props.onChartMouseOut || this._prevTargetID.indexOf('legendentry') === 0) {
      // Don't execute mouseOut when the previously hovered element is the legend
      return;
    }

    this.props.onChartMouseOut();
  },

  render() {
    return (
      <div {..._.omit(this.props, 'children', 'options', 'chartData', 'chart', 'onChartMouseOut', 'onChartMouseOver')} />
    );
  },

});

export default GoogleChart;
