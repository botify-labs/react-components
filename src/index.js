import React from 'react';
import ChartDataGoogleDataAdapter from './adapters/ChartDataGoogleDataAdapter';
import ChartData from './models/ChartData';
import Panel from './components/panel/panel';
import Chart from './components/charts/chart';
import LineChart from './components/charts/line-chart';
import PieChart from './components/charts/pie-chart';
import Table from './components/table';

export default {
  React,
  Panel,
  Table,
  Charts: {
    LineChart,
    PieChart
  }
};