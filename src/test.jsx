// buildErrorTree = (inst) ->
//   tree =
//     inst: inst
//     displayName: inst._currentElement.type.displayName
//     props: inst._currentElement._store.props
//     parent:
//       if inst._currentElement._owner?
//         buildErrorTree inst._currentElement._owner
//       else
//         null

//   return tree

// createElement = React.createElement
// React.createElement = ->
//   element = createElement.apply React, arguments

//   for fnName in ['render']
//     fn = element.type.prototype[fnName]
//     element.type.prototype[fnName] = ->
//       try
//         return (fn.apply this, arguments)
//       catch e
//         tree = buildErrorTree this._reactInternalInstance
//         return DOM.div null, 'ERROR HAPPENED WHAAAAT'
//   return element

import React from 'react/addons';
import {Panel, Charts, Table} from './index';
import {List} from 'immutable';
import ChartData from './models/ChartData';
import Immutable from 'immutable';
import ChartDataGoogleDataAdapter from './adapters/ChartDataGoogleDataAdapter';

var COLORS = {}; //#lol
var chartData = new ChartData();

chartData.addDimension('delay');
chartData.addDimensionGroup('delay', 'fast', new Immutable.Map({label: "Fast (<500 ms)", color: COLORS.GOOD}));
chartData.addDimensionGroup('delay', 'medium', new Immutable.Map({label: "Medium (500 ms < 1 s)", color: COLORS.MEDIUM}));
chartData.addDimensionGroup('delay', 'slow', new Immutable.Map({label: "Slow (1 s < 2 s)", color: COLORS.BAD}));
chartData.addDimensionGroup('delay', 'slowest', new Immutable.Map({label: "Slowest (>2 s)", color: COLORS.VERY_BAD}));

chartData.addDimension('content_type');
chartData.addDimensionGroup('content_type', "text_html", new Immutable.Map({color: COLORS.GOOD, label: "text/html"}));
chartData.addDimensionGroup('content_type', "image_jpeg", new Immutable.Map({color: COLORS.YELLOW, label: "image/jpeg"}));
chartData.addDimensionGroup('content_type', "image_png", new Immutable.Map({color: COLORS.YELLOW, label: "image/png"}));
chartData.addDimensionGroup('content_type', "image_gif", new Immutable.Map({color: COLORS.YELLOW, label: "image/gif"}));
chartData.addDimensionGroup('content_type', "text_css", new Immutable.Map({color: COLORS.ORANGE1, label: "text/css"}));
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

var SpecificPanelController = React.createClass({

  displayName: 'SpecificPanelController',

  render() {
    return (
      <Panel title="Hello world">
        <Charts.LineChart key="pieChart" chartData={chartData} adapterClass={ChartDataGoogleDataAdapter}/>
        <Table key="table" />
      </Panel>
    );
  }

});

google.load('visualization', '1.0', {'packages':['corechart']});

google.setOnLoadCallback(() => {
  React.render(<SpecificPanelController />, document.getElementById('container'))
});