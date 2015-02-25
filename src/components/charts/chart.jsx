import React from 'react';
import _ from 'lodash';

import ChartData from '../../models/ChartData';
import {Map} from 'immutable';
import './style.scss';

var ChartTooltip = React.createClass({

  displayName: 'ChartTooltip',

  propTypes: {
    chartData: React.PropTypes.instanceOf(ChartData),
    data: React.PropTypes.instanceOf(Map),
    position: React.PropTypes.shape({
      top: React.PropTypes.number.isRequired,
      left: React.PropTypes.number.isRequired
    })
  },

  getInitialState() {
    return {
      width: null,
      height: null,
    };
  },

  componentDidMount() {
    var node = this.getDOMNode();

    this.setState({
      width: node.offsetWidth,
      height: node.offsetHeight,
    });
  },

  render() {
    var style;
    var {width, height} = this.state;
    if (width === null) {
      style = {position: 'absolute', top: -9999, left: -9999};
    } else {
      style = this._getStyle();
    }

    var children = this.props.data.map((dataValues, dataKeys) => {
      var groups = dataKeys.map((groupKey, dimKey) => {
        var dimension = this.props.chartData.getDimension(dimKey);
        var group = this.props.chartData.getDimensionGroup(dimKey, groupKey);
        return <div>{dimKey}: {groupKey}</div>;
      });
      var metrics = dataValues.map((value) => {
        return <div>{value}</div>;
      });
      return (
        <div>
          <div>{groups.toJS()}</div>
          <div>{metrics.toJS()}</div>
        </div>
      );
    });

    return (
      <div className="ChartTooltip" style={style}>
        {children.toJS()}
      </div>
    );
  },

  _getStyle() {
    var style = {position: 'absolute'};
    var margin = 10; // x and y margin between the mouse and the tooltip
    var {position} = this.props;
    var {width, height} = this.state;
    var containerWidth = document.body.offsetWidth;

    // Calculate the best position for the tooltip so that
    //  * it won't overlay its given focus position
    //  * it won't cross its container's boundaries

    if (position.top - height - margin > 0) {
      style.top = position.top - height - margin;
    } else {
      style.top = position.top + margin;
    }

    if (position.left - width / 2 > 0 && position.left + width / 2 < containerWidth) {
      style.left = position.left - width / 2;
    } else if (position.left - width - margin > 0) {
      style.left = position.left - width - margin;
    } else {
      style.left = position.left + margin;
    }

    return style;
  }

});

var ChartWithTooltip = React.createClass({

  displayName: 'ChartWithTooltip',

  getInitialState() {
    return {
      hoveredData: null,
      mousePosition: {top: -9999, left: -9999},
    };
  },

  render() {
    return (
      <div>
        {this.state.hoveredData &&
          <ChartTooltip
            position={this.state.mousePosition}
            chartData={this.props.chartData}
            data={this.state.hoveredData}
          />
        }
        <GoogleChart
          {...this.props}
          onChartMouseOver={this._handleChartMouseOver}
          onChartMouseOut={this._handleChartMouseOut}
          onMouseMove={this._handleMouseMove}
        />
      </div>
    );
  },

  _handleMouseMove(e) {
    // Keep track of the mouse position so that we can have the tooltip
    // follow the cursor
    this.setState({
      mousePosition: {
        // TODO: replace this with actual values
        top: e.pageY,
        left: e.pageX
      }
    });
  },

  _handleChartMouseOver(data) {
    // Show the tooltip when a chart element is hovered
    this.setState({hoveredData: data});
  },

  _handleChartMouseOut() {
    // Hide the tooltip when a chart element stops being hovered
    this.setState({hoveredData: null});
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
    chartData: React.PropTypes.object,
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
    // TODO: use immutable!
    return !(_.isEqual(nextProps, this.props) && _.isEqual(nextState, this.state));
  },

  componentDidUpdate(prevProps, prevState) {
    this._drawChart();
  },

  render() {
    return (
      <div {..._.omit(this.props, 'children', 'options', 'chartData', 'chart', 'onChartMouseOut', 'onChartMouseOver')}>
        {this.props.children}
        <div ref="chart-container"></div>
        <img ref="chart-image" />
      </div>
    );
  },

  /**
   * Instanciates the Google Chart from the chart constructor prop.
   * This should only be called once.
   */
  _initializeChart() {
    this.adapter = new this.props.adapterClass(this.props.chartData);

    // TODO: Remove this awful hack and move this logic into Chart
    this.chartData = this.adapter.toGoogleDataArray();

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

    var filter = this.adapter.getDataKeys(e);
    var data = this.props.chartData.filterData(filter);

    this.props.onChartSelect(data);
  },

  /**
   * Called when the mouse enters a chart data point or category
   */
  _handleChartMouseOver(e) {
    if (!this.props.onChartMouseOver) {
      return;
    }

    var filter = this.adapter.getDataKeys(e);
    var data = this.props.chartData.filterData(filter);

    this.props.onChartMouseOver(data);
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
    this.chart.draw(this.chartData, this._getOptions());
  },

});

GoogleChart.WithTooltip = ChartWithTooltip;

export default GoogleChart;