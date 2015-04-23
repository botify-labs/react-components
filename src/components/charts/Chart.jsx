import React from 'react/addons';

import HoverTooltip from '../tooltip/HoverTooltip';
import TooltipTable from '../tooltip/TooltipTable';
import ChartData from '../../models/ChartData';

var Chart = React.createClass({

  displayName: 'Chart',

  propTypes: {
    chartData: React.PropTypes.instanceOf(ChartData),
  },

  getInitialState() {
    return {
      hoveredData: null,
    };
  },

  getImageURI() {
    return this.refs.chart.getImageURI();
  },

  render() {
    return (
      <HoverTooltip
        hasTooltip={!!this.state.hoveredData}
        renderTooltip={this._renderTooltip}
      >
        <this.props.chart
          {...this.props}
          key="chart"
          ref="chart"
          onChartMouseOver={this._handleChartMouseOver}
          onChartMouseOut={this._handleChartMouseOut}
          onMouseMove={this._updateMousePosition}
        />
      </HoverTooltip>
    );
  },

  _renderTooltip() {
    var data = this.state.hoveredData.entrySeq().map(([dataKeys, dataValues]) => {
      var groups = dataKeys.entrySeq().map(([dimKey, groupKey], idx) => {
        var dimension = this.props.chartData.getDimension(dimKey);
        var group = this.props.chartData.getDimensionGroup(dimKey, groupKey);
        return [dimension.get('label'), group.get('label')];
      });

      var metrics = dataValues.map((value, idx) => {
        var metric = this.props.chartData.getMetric(idx);
        return [metric.get('label'), metric.get('render')(value)];
      });

      return <TooltipTable groups={groups.toJS()} metrics={metrics.toJS()} />;
    });

    return (
      <div className="Chart-tooltip">
        {data.toJS()}
      </div>
    );
  },

  _handleChartMouseOver(data) {
    // Show the tooltip when a chart element is hovered
    this.setState({hoveredData: data});
  },

  _handleChartMouseOut() {
    // Hide the tooltip when a chart element stops being hovered
    this.setState({hoveredData: null});
  },

});

export default Chart;
