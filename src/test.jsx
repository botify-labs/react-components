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

COLORS = {}; //#lol
var chartData = new ChartData();
chartData.rawData = new List([
  {
    [
      {'delay': {from: 0, to: 500}},
      {'content_type': 'text/html'}
    ]: [1]
  },
  {
    [
      {'delay': {from: 500, to: 1000}},
      {'content_type': 'text/html'}
    ]: [3]
  },
  {
    [
      {'delay': {from: 500, to: 1000}},
      {'content_type': 'text/css'}
    ]: [4]
  },
  {
    [
      {'delay': {from: 2000}},
      {'content_type': 'javascript'}
    ]: [4]
  }
];
chartData.dimensions = new OrderMap(
  {
    'delay': {
      groups:{
        {from: 0, to: 500}: {label: "Fast (<500 ms)", color: COLORS.GOOD},
        {from: 500, to: 1000}: {label: "Medium (500 ms < 1 s)", color: COLORS.MEDIUM},
        {from: 1000, to: 2000}: {label: "Slow (1 s < 2 s)", color: COLORS.BAD},
        {from: 2000}: {label: "Slowest (>2 s)", color: COLORS.VERY_BAD}
      }
    }
  },
  {
    'content_type': {
      groups: {
        "text/html": {color: COLORS.GOOD},
        "image/jpeg": {color: COLORS.YELLOW},
        "image/png": {color: COLORS.YELLOW},
        "image/gif": {color: COLORS.YELLOW},
        "text/css": {color: COLORS.ORANGE1},
        "not-set": {label: "Not Set", color: COLORS.VERY_BAD},
      }
    }
  }
);



var SpecificPanelController = React.createClass({

  displayName: 'SpecificPanelController',

  render() {
    return (
      <Panel title="Hello world">
        <Charts.LineChart key="pieChart" />
        <Table key="table" />
      </Panel>
    );
  }

});

google.load('visualization', '1.0', {'packages':['corechart']});

google.setOnLoadCallback(() => React.render(<SpecificPanelController />, document.getElementById('container')));