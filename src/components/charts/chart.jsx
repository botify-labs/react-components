import React from 'react';
import _ from 'lodash';

var ChartWithTooltip = React.createClass({

  displayName: 'ChartWithTooltip',

  getInitialState() {
    return {
      hoveredElement: null,
      mousePosition: null,
    };
  },

  render() {
    return (
      <GoogleChart
              onChartMouseOver={this._handleChartMouseOver}
              onChartMouseOut={this._handleChartMouseOut}
              onMouseMove={this._handleMouseMove}
              {...this.props}>
        {this.state.hoveredElement && this._renderTooltip()}
      </GoogleChart>
    );
  },

  _renderTooltip() {
    var style = {
      position: 'absolute',
    };

    // TODO: Calculate tooltip pos

    return (
      <div className="Chart-tooltip" style={style}>
        // TODO: Render tooltip data
      </div>
    );
  },

  _handleMouseMove(e) {
    // Keep track of the mouse position so that we can have the tooltip
    // follow the cursor
    this.setState({
      mousePosition: {
        // TODO: replace this with actual values
        top: e.offsetY,
        left: e.offsetX
      }
    });
  },

  _handleChartMouseOver(hoveredElement) {
    // Show the tooltip when a chart element is hovered
    this.setState({hoveredElement});
  },

  _handleChartMouseOut() {
    // Hide the tooltip when a chart element stops being hovered
    this.setState({
      hoveredElement: null,
    });
  }

});

/**
 * Wrapper around a generic Google Chart
 * TODO: Maybe use a mixin instead?
 * Something like ChartMixin({
 *   chart: google.visualization.PieChart
 * })
 */
var GoogleChart = React.createClass({

  displayName: 'GoogleChart',

  propTypes: {
    // Google Chart data
    // TODO: define structure
    data: React.PropTypes.object,
    // Google Chart options
    // TODO: define structure
    options: React.PropTypes.object,
  },

  /**
   * Returns underlying chart's image URI representation
   * @return {String}
   */
  getImageURI() {
    return this.chart.getImageURI();
  },

  componentDidMount() {
    this._initializeChart();

    // Redraw the chart whenever the window is resized
    window.addEventListener('resize', this._drawChart);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._drawChart);
  },

  shouldComponentUpdate(nextProps, nextState) {
    console.log('?', _.isEqual(nextProps, this.props) && _.isEqual(nextState, this.state));
    // TODO: use immutable!
    return _.isEqual(nextProps, this.props) && _.isEqual(nextState, this.state);

  },

  componentDidUpdate(prevProps, prevState) {
    this._drawChart();
  },

  render() {
    return (
      <div {...this.props}>
        <div ref="chart-container"></div>
        <img ref="chart-image"></img>
        {this.props.children}
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
    google.visualization.events.addListener(this.chart, 'onmouseover', this._handleChartMouseOver);
    google.visualization.events.addListener(this.chart, 'onmouseout', this._handleChartMouseOut);
  },

  /**
   * Called when a chart data point or category is selected
   */
  _handleChartSelect(e) {
    if (!this.props.onChartSelect) {
      return;
    }

    var selectedElement = this.props.adapter.getDataKeys(e);
    this.props.onChartSelect && this.props.onChartSelect(selectedElement);
  },

  /**
   * Called when the mouse enters a chart data point or category
   */
  _handleChartMouseOver(e) {
    if (!this.props.onChartMouseOver) {
      return;
    }

    var hoveredElement = this.props.adapter.getDataKeys(e);
    this.props.onChartMouseOver && this.props.onChartMouseOver(hoveredElement);
  },

  /**
   * Called when the mouse leaves a chart data point or category
   */
  _handleChartMouseOut() {
    this.props.onChartMouseOut && this.props.onChartMouseOut();
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

GoogleChart.WithTooltip = ChartWithTooltip;

export default GoogleChart;