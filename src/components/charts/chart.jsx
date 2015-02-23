import React from 'react';
import _ from 'lodash';

var ChartTooltip = React.createClass({

  displayName: 'ChartTooltip',

  render() {
    return (
      <div className="ChartTooltip"></div>
    );
  }

});

/**
 * Wrapper around a generic Google Chart
 * TODO: Maybe use a mixin instead?
 * Something like ChartMixin({
 *   chart: google.visualization.PieChart
 * })
 * TODO: Add tooltips!
 */
var Chart = React.createClass({

  displayName: 'Chart',

  propTypes: {
    // Google Chart data
    // TODO: define structure
    data: React.PropTypes.object,
    // Google Chart options
    // TODO: define structure
    options: React.PropTypes.object,
  },

  getInitialState() {
    return {
      showTooltip: false,
      hoveredElement: null,
    };
  },

  exportChart() {
    this.refs['chart-image'].getDOMNode().src = this.chart.getImageURI();
  },

  componentDidMount() {
    this._initializeChart();

    // Redraw the chart whenever the window is resized
    window.addEventListener('resize', this._drawChart);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._drawChart);
  },

  componentDidUpdate(prevProps, prevState) {
    // TODO: do an options and data equality check, otherwise the google chart loses its state
    // every time we update the component
    if (_.isEqual(prevProps, this.props) && _.isEqual(prevState, this.state)) {
      this._drawChart();
    }
  },

  render() {
    return (
      <div>
        {this.state.showTooltip && this._renderTooltip()}
        <div ref="chart-container"></div>
        <img ref="chart-image"></img>
      </div>
    );
  },

  /**
   * Instanciates the Google Chart from the chart constructor prop.
   * This should only be called once.
   */
  _initializeChart() {
    this.chart = new this.props.chart(this.refs['chart-container'].getDOMNode());

    this._bindChartEvents();

    this._drawChart();
  },

  /**
   * Binds event handlers to chart events
   */
  _bindChartEvents() {
    google.visualization.events.addListener(this.chart, 'select', this._handleChartSelect);
    google.visualization.events.addListener(this.chart, 'onmouseover', this._handleChartMouseover);
    google.visualization.events.addListener(this.chart, 'onmouseout', this._handleChartMouseout);
  },

  /**
   * Called when a chart data point or category is selected
   */
  _handleChartSelect() {
    console.log('select');
  },

  /**
   * Called when the mouse enters a chart data point or category
   */
  _handleChartMouseover(catIdx, serieIdx) {
    this.setState({
      showTooltip: true,
      hoveredElement: {catIdx, serieIdx},
    });
  },

  /**
   * Called when the mouse leaves a chart data point or category
   */
  _handleChartMouseout() {
    this.setState({
      showTooltip: false,
      hoveredElement: null,
    });
  },

  _renderTooltip() {
    return (
      <ChartTooltip />
    );
  },

  /**
   * Returns the google chart options
   */
  _getOptions() {
    return _.assign({}, this.props.options, {
      tooltip: {
        trigger: 'none'
      }
    });
  },

  /**
   * Redraws the chart with data and options props.
   */
  _drawChart() {
    this.chart.draw(this.props.data, this._getOptions());
  },

});

export default Chart;