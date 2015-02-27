import React from 'react/addons';

import HoverTooltip from '../tooltip/hover-tooltip';

var Chart = React.createClass({

  displayName: 'Chart',

  getInitialState() {
    return {
      hoveredData: null
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
        return (
          <tr key={idx}>
            <td>{dimension.get('label')}</td>
            <td>{group.get('label')}</td>
          </tr>
        );
      });

      var metrics = dataValues.map((value, idx) => {
        var metric = this.props.chartData.getMetric(idx);
        return (
          <tr key={idx}>
            <td>{metric.get('label')}</td>
            <td>{metric.get('render')(value)}</td>
          </tr>
        );
      });

      return (
        <table className="Tooltip-datum">
          <tbody className="groups">
            {groups.toJS()}
          </tbody>
          <tbody className="metrics">
            {metrics.toJS()}
          </tbody>
        </table>
      );
    });

    return (
      <div className="Tooltip-data">
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
  }

});

export default Chart;