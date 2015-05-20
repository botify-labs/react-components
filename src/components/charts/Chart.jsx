import React from 'react/addons';

import FollowCursor from '../misc/FollowCursor';
import TooltipTable from '../tooltip/TooltipTable';
import ChartData from '../../models/ChartData';

let Chart = React.createClass({

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
    let data = this.state.hoveredData.entrySeq().map(([dataKeys, dataValues]) => {
      let groups = dataKeys.entrySeq().map(([dimKey, groupKey], idx) => {
        let dimension = this.props.chartData.getDimension(dimKey);
        let group = this.props.chartData.getDimensionGroup(dimKey, groupKey);
        return [dimension.get('label'), group.get('label')];
      });

      let metrics = dataValues.map((value, idx) => {
        let metric = this.props.chartData.getMetric(idx);
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
