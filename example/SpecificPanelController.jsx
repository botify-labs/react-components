import React, { PropTypes } from 'react/addons';
import Panel from '../src/components/panel/Panel';
import Table from '../src/components/Table';
import Chart from '../src/components/charts/Chart';
import GoogleColumnChart from '../src/components/charts/google/GoogleColumnChart';
import VennDiagram from '../src/components/venn-diagram/VennDiagram';
import ChartData from '../src/models/ChartData';
import VennData from '../src/models/VennData';
import Immutable from 'immutable';
import Color from 'color';

const COLORS = {}; // #lol

const chartData = new ChartData();

chartData.addMetric(Immutable.Map({
  label: 'Count',
  render: v => v,
}));

chartData.addDimension('delay', Immutable.Map({
  label: 'Delay',
}));
chartData.addDimensionGroup('delay', 'fast', Immutable.Map({label: 'Fast (<500 ms)', color: COLORS.GOOD}));
chartData.addDimensionGroup('delay', 'medium', Immutable.Map({label: 'Medium (500 ms < 1 s)', color: COLORS.MEDIUM}));
chartData.addDimensionGroup('delay', 'slow', Immutable.Map({label: 'Slow (1 s < 2 s)', color: COLORS.BAD}));
chartData.addDimensionGroup('delay', 'slowest', Immutable.Map({label: 'Slowest (>2 s)', color: COLORS.VERY_BAD}));

chartData.addDimension('content_type', Immutable.Map({
  label: 'Content Type',
}));
chartData.addDimensionGroup('content_type', 'text_html', Immutable.Map({color: COLORS.GOOD, label: 'text/html'}));
chartData.addDimensionGroup('content_type', 'image_jpeg', Immutable.Map({color: COLORS.YELLOW, label: 'image/jpeg'}));
chartData.addDimensionGroup('content_type', 'image_png', Immutable.Map({color: COLORS.YELLOW, label: 'image/png'}));
chartData.addDimensionGroup('content_type', 'image_gif', Immutable.Map({color: COLORS.YELLOW, label: 'image/gif'}));
chartData.addDimensionGroup('content_type', 'text_css', Immutable.Map({color: COLORS.ORANGE1, label: 'text/css'}));
chartData.addDimensionGroup('content_type', 'javascript', Immutable.Map({color: COLORS.ORANGE1, label: 'javascript'}));
chartData.addDimensionGroup('content_type', 'not_set', Immutable.Map({label: 'Not Set', color: COLORS.VERY_BAD}));

chartData.setData(Immutable.Map({
  delay: 'fast',
  content_type: 'text_html',
}), Immutable.List([1]));
chartData.setData(Immutable.Map({
  delay: 'medium',
  content_type: 'text_html',
}), Immutable.List([3]));
chartData.setData(Immutable.Map({
  delay: 'medium',
  content_type: 'text_css',
}), Immutable.List([4]));
chartData.setData(Immutable.Map({
  delay: 'slowest',
  content_type: 'javascript',
}), Immutable.List([4]));

const newUrls = 100;
const disappearedUrls = 50;
const allUrls = 150;

const currentUrls = allUrls;
const previousUrls = disappearedUrls + (allUrls - newUrls);
const commonUrls = allUrls - newUrls;

const vennData = new VennData();

const c1 = Color('#80bbe7');
const c2 = Color('#ffbf85');
const c3 = c1.clone().mix(c2, 0.5).negate();

const set1 = Immutable.Map({
  size: currentUrls,
  color: c1.rgbString(),
  label: 'New URLs',
});

const set2 = Immutable.Map({
  size: previousUrls,
  color: c2.rgbString(),
  label: 'Disappeared URLs',
});

vennData.addSet(set1);
vennData.addSet(set2);

const set3 = Immutable.Map({
  size: commonUrls,
  color: c3.rgbString(),
  label: 'Common URLs',
});

vennData.addIntersection(Immutable.Set.of(set1, set2), set3);

const ChartRenderer = React.createClass({

  displayName: 'ChartRenderer',

  propTypes: {
    children: PropTypes.node,
  },

  render() {
    const style = {
      width: 1000,
      height: 500,
    };

    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  },

});

const SpecificPanelController = React.createClass({

  displayName: 'SpecificPanelController',

  _getDisplayModes() {
    return [
      {
        id: 'vennDiagram',
        label: 'Display Venn Diagram',
        render: this._renderVennDiagram,
      },
      {
        id: 'chart',
        label: 'Display Chart',
        render: this._renderChart,
      },
      {
        id: 'table',
        label: 'Display Table',
        render: this._renderTable,
      },
    ];
  },

  _getActions() {
    return [
      {
        id: 'exportChart',
        label: 'Export Chart',
        callback: this._exportChart,
      },
    ];
  },

  _exportChart() {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const style = {
      width: 1000,
      height: 500,
    };

    const chart = React.render(
      <ChartRenderer
        style={style}
        getImageURI={() => this.refs.chart.getImageURI()}
      >
        {this._renderChart()}
      </ChartRenderer>
    , div);

    const imageURI = chart.getImageURI();
    window.open(imageURI);

    document.body.removeChild(div);
  },

  render() {
    return (
      <Panel
        title="Hello world"
        defaultDisplayModeId="vennDiagram"
        displayModes={this._getDisplayModes()}
        actions={this._getActions()}
      />
    );
  },

  _renderChart() {
    return (
      <Chart
        key="columnChart"
        ref="chart"
        chart={GoogleColumnChart}
        chartData={chartData}
      />
    );
  },

  _renderVennDiagram() {
    const onClick = () => {
      console.log('hello'); // eslint-disable-line
    };
    return (
      <VennDiagram
        key="vennDiagram"
        vennData={vennData}
        onClick={onClick}
        inclusive
      />
    );
  },

  _renderTable() {
    return (
      <Table
        key="table"
        chartData={chartData}
      />
    );
  },

});

export default SpecificPanelController;
