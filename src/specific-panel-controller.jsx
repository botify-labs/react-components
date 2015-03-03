import React from 'react/addons';
import Panel from './components/panel/panel';
import Table from './components/table';
import Chart from './components/charts/chart';
import GoogleColumnChart from './components/charts/google/google-column-chart';
import VennDiagram from './components/venn-diagram';
import ChartData from './models/ChartData';
import Immutable from 'immutable';

var COLORS = {}; //#lol

var chartData = new ChartData();

chartData.addMetric(Immutable.Map({
  label: 'Count',
  render: v => v
}));

chartData.addDimension('delay', Immutable.Map({
  label: 'Delay'
}));
chartData.addDimensionGroup('delay', 'fast', new Immutable.Map({label: "Fast (<500 ms)", color: COLORS.GOOD}));
chartData.addDimensionGroup('delay', 'medium', new Immutable.Map({label: "Medium (500 ms < 1 s)", color: COLORS.MEDIUM}));
chartData.addDimensionGroup('delay', 'slow', new Immutable.Map({label: "Slow (1 s < 2 s)", color: COLORS.BAD}));
chartData.addDimensionGroup('delay', 'slowest', new Immutable.Map({label: "Slowest (>2 s)", color: COLORS.VERY_BAD}));

chartData.addDimension('content_type', Immutable.Map({
  label: 'Content Type'
}));
chartData.addDimensionGroup('content_type', "text_html", new Immutable.Map({color: COLORS.GOOD, label: "text/html"}));
chartData.addDimensionGroup('content_type', "image_jpeg", new Immutable.Map({color: COLORS.YELLOW, label: "image/jpeg"}));
chartData.addDimensionGroup('content_type', "image_png", new Immutable.Map({color: COLORS.YELLOW, label: "image/png"}));
chartData.addDimensionGroup('content_type', "image_gif", new Immutable.Map({color: COLORS.YELLOW, label: "image/gif"}));
chartData.addDimensionGroup('content_type', "text_css", new Immutable.Map({color: COLORS.ORANGE1, label: "text/css"}));
chartData.addDimensionGroup('content_type', "javascript", new Immutable.Map({color: COLORS.ORANGE1, label: "javascript"}));
chartData.addDimensionGroup('content_type', "not_set", new Immutable.Map({label: "Not Set", color: COLORS.VERY_BAD}));

chartData.setData(new Immutable.Map({
  'delay': 'fast',
  'content_type': 'text_html'
}), new Immutable.List([1]));
chartData.setData(new Immutable.Map({
  'delay': 'medium',
  'content_type': 'text_html'
}), new Immutable.List([3]));
chartData.setData(new Immutable.Map({
  'delay': 'medium',
  'content_type': 'text_css'
}), new Immutable.List([4]));
chartData.setData(new Immutable.Map({
  'delay': 'slowest',
  'content_type': 'javascript'
}), new Immutable.List([4]));

var newUrls = 100;
var disappearedUrls = 50;
var allUrls = 150;

var currentUrls = allUrls;
var previousUrls = disappearedUrls + (allUrls - newUrls);
var commonUrls = allUrls - newUrls;

// TODO: faire classe? définir structure
// addSet
// addIntersection
var sets = [
  {
    metadata: {
      label: 'Current URLs',
      color: '#FFDC00'
    },
    size: 100
  },
  {
    metadata: {
      label: 'Previous URLs',
      color: '#FF4136'
    },
    size: 80
  }
];

var intersections = [
  {
    sets: [0, 1],
    metadata: {
      label: 'Common URLs',
      color: '#FF851B'
    },
    size: 40
  }
];

// TODO: offrir la possibilité
var exclusives = [
  {
    set: 0,
    label: 'New URLS'
  },
  {
    set: 1,
    label: 'Disappeared URLs'
  }
];

var ChartRenderer = React.createClass({

  getImageURI() {
    return this.refs.chart.getImageURI();
  },

  render() {
    var style = {
      width: 1000,
      height: 500
    };

    return (
      <div style={style}>
        {this.props.render()}
      </div>
    )
  }

});

var SpecificPanelController = React.createClass({

  displayName: 'SpecificPanelController',

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

  _getDisplayModes() {
    return [
      {
        id: 'vennDiagram',
        label: 'Display Venn Diagram',
        render: this._renderVennDiagram
      },
      {
        id: 'chart',
        label: 'Display Chart',
        render: this._renderChart
      }
    ];
  },

  _getActions() {
    return [
      {
        id: 'exportChart',
        label: 'Export Chart',
        callback: this._exportChart
      }
    ];
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
    return (
      <VennDiagram
        key="vennDiagram"
        sets={sets}
        intersections={intersections}
        exclusives={exclusives}
      />
    );
  },

  _exportChart() {
    var div = document.createElement('div');
    document.body.appendChild(div);

    var style = {
      width: 1000,
      height: 500
    };

    var chart = React.render(<ChartRenderer render={this._renderChart} />, div);

    var imageURI = chart.getImageURI();
    window.open(imageURI);

    document.body.removeChild(div);
  }

});

export default SpecificPanelController;
