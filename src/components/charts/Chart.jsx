import React, { PropTypes } from 'react';

import FollowCursor from '../misc/FollowCursor';
import Tooltip from '../tooltip/Tooltip';
import TooltipTable from '../tooltip/TooltipTable';
import ChartData from '../../models/ChartData';

const Chart = React.createClass({

  displayName: 'Chart',

  propTypes: {
    chartData: PropTypes.instanceOf(ChartData),
  },

  getInitialState() {
    return {
      hoveredData: null,
    };
  },

  getImageURI() {
    return this.refs.chart.getImageURI();
  },

  _handleChartMouseOver(data) {
    // Show the tooltip when a chart element is hovered
    this.setState({hoveredData: data});
  },

  _handleChartMouseOut() {
    // Hide the tooltip when a chart element stops being hovered
    this.setState({hoveredData: null});
  },

  render() {
    return (
      <FollowCursor
        hasOverlay={!!this.state.hoveredData}
        renderOverlay={this._renderTooltip}
      >
        <this.props.chart
          {...this.props}
          key="chart"
          ref="chart"
          onChartMouseOver={this._handleChartMouseOver}
          onChartMouseOut={this._handleChartMouseOut}
          onMouseMove={this._updateMousePosition}
        />
      </FollowCursor>
    );
  },

  _renderTooltip() {
    const data = this.state.hoveredData.entrySeq().map(([dataKeys, dataValues]) => {
      const groups = dataKeys.entrySeq().map(([dimKey, groupKey], idx) => {
        const dimension = this.props.chartData.getDimension(dimKey);
        const group = this.props.chartData.getDimensionGroup(dimKey, groupKey);
        return [dimension.get('label'), group.get('label')];
      });

      const metrics = dataValues.map((value, idx) => {
        const metric = this.props.chartData.getMetric(idx);
        return [metric.get('label'), metric.get('render')(value)];
      });

      return <TooltipTable groups={groups.toJS()} metrics={metrics.toJS()} />;
    });

    return (
      <Tooltip className="Chart-tooltip">
        {data.toJS()}
      </Tooltip>
    );
  },

});

export default Chart;
