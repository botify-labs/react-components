import React from 'react/addons';

import GoogleChart from './google-chart';
import ChartTooltip from './chart-tooltip.jsx';

import './style.scss';

var Chart = React.createClass({

  displayName: 'Chart',

  getInitialState() {
    return {
      hoveredData: null,
      mousePosition: {top: -9999, left: -9999},
    };
  },

  render() {
    return (
      <div>
        <React.addons.CSSTransitionGroup transitionName="appear">
          {this.state.hoveredData &&
            <ChartTooltip
              key={this.state.hoveredData.hashCode()}
              position={this.state.mousePosition}
              chartData={this.props.chartData}
              data={this.state.hoveredData}
            />
          }
        </React.addons.CSSTransitionGroup>
        <GoogleChart
          {...this.props}
          key="chart"
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

export default Chart;