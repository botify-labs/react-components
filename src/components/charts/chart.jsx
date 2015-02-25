import React from 'react/addons';

import ChartData from '../../models/ChartData';
import GoogleChart from './google-chart';
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

export default Chart;