import React from 'react/addons';
import Panel from '../components/panel/panel';
import Table from '../components/table';
import Chart from '../components/charts/chart';
import GoogleColumnChart from '../components/charts/google/google-column-chart';
import VennDiagram from '../components/venn-diagram/venn-diagram';
import ChartData from '../models/ChartData';
import VennData from '../models/VennData';
import Immutable from 'immutable';
import Color from 'color';

var COLORS = {}; //#lol

var chartData = new ChartData();

chartData.addMetric(Immutable.Map({
  label: 'Count',
  render: v => v
}));

chartData.addDimension('delay', Immutable.Map({
  label: 'Delay'
}));
chartData.addDimensionGroup('delay', 'fast', Immutable.Map({label: "Fast (<500 ms)", color: COLORS.GOOD}));
chartData.addDimensionGroup('delay', 'medium', Immutable.Map({label: "Medium (500 ms < 1 s)", color: COLORS.MEDIUM}));
chartData.addDimensionGroup('delay', 'slow', Immutable.Map({label: "Slow (1 s < 2 s)", color: COLORS.BAD}));
chartData.addDimensionGroup('delay', 'slowest', Immutable.Map({label: "Slowest (>2 s)", color: COLORS.VERY_BAD}));

chartData.addDimension('content_type', Immutable.Map({
  label: 'Content Type'
}));
chartData.addDimensionGroup('content_type', "text_html", Immutable.Map({color: COLORS.GOOD, label: "text/html"}));
chartData.addDimensionGroup('content_type', "image_jpeg", Immutable.Map({color: COLORS.YELLOW, label: "image/jpeg"}));
chartData.addDimensionGroup('content_type', "image_png", Immutable.Map({color: COLORS.YELLOW, label: "image/png"}));
chartData.addDimensionGroup('content_type', "image_gif", Immutable.Map({color: COLORS.YELLOW, label: "image/gif"}));
chartData.addDimensionGroup('content_type', "text_css", Immutable.Map({color: COLORS.ORANGE1, label: "text/css"}));
chartData.addDimensionGroup('content_type', "javascript", Immutable.Map({color: COLORS.ORANGE1, label: "javascript"}));
chartData.addDimensionGroup('content_type', "not_set", Immutable.Map({label: "Not Set", color: COLORS.VERY_BAD}));

chartData.setData(Immutable.Map({
  'delay': 'fast',
  'content_type': 'text_html'
}), Immutable.List([1]));
chartData.setData(Immutable.Map({
  'delay': 'medium',
  'content_type': 'text_html'
}), Immutable.List([3]));
chartData.setData(Immutable.Map({
  'delay': 'medium',
  'content_type': 'text_css'
}), Immutable.List([4]));
chartData.setData(Immutable.Map({
  'delay': 'slowest',
  'content_type': 'javascript'
}), Immutable.List([4]));

var newUrls = 100;
var disappearedUrls = 50;
var allUrls = 150;

var currentUrls = allUrls;
var previousUrls = disappearedUrls + (allUrls - newUrls);
var commonUrls = allUrls - newUrls;

var vennData = new VennData();

var c1 = Color('#80bbe7');
var c2 = Color('#ffbf85');
var c3 = c1.clone().mix(c2, 0.5).negate();

var set1 = Immutable.Map({
  size: currentUrls,
  color: c1.rgbString(),
  label: 'New URLs',
});

var set2 = Immutable.Map({
  size: previousUrls,
  color: c2.rgbString(),
  label: 'Disappeared URLs',
});

vennData.addSet(set1);
vennData.addSet(set2);

var set3 = Immutable.Map({
  size: commonUrls,
  color: c3.rgbString(),
  label: 'Common URLs',
});

vennData.addIntersection(Immutable.Set.of(set1, set2), set3);

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
      },
      {
        id: 'table',
        label: 'Display Table',
        render: this._renderTable
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
        vennData={vennData}
        onClick={() => console.log('hello')}
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
