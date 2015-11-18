import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import FollowCursor from '../../misc/FollowCursor';
import Tooltip from '../../tooltip/Tooltip';
import TooltipTable from '../../tooltip/TooltipTable';
import ChartData from '../../../models/ChartData';
import ChartDataGoogleDataAdapter from '../../../adapters/ChartDataGoogleDataAdapter';


const GoogleChartBase = React.createClass({

  displayName: 'GoogleChartBase',

  propTypes: {
    // Called when chart data is selected
    onChartSelect: PropTypes.func,
    onChartMouseOver: PropTypes.func,
    onChartMouseOut: PropTypes.func,
    // Subclass of google.visualization.CoreChart
    googleChart: PropTypes.func,
    // Chart data
    chartData: PropTypes.instanceOf(ChartData).isRequired,
    // Extended google chart options
    options: PropTypes.shape({
      tooltip: PropTypes.shape({
        showWholeCategory: PropTypes.bool,
      }),
    }),
  },

  componentDidMount() {
    this.initializeChart();

    // Redraw the chart whenever the window is resized
    window.addEventListener('resize', this._drawChart);
  },

  shouldComponentUpdate(nextProps, nextState) {
    // TODO: use immutable!
    return !(nextProps.chartData === this.props.chartData);
  },

  componentDidUpdate(prevProps, prevState) {
    this.drawChart();
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._drawChart);
  },

  /**
   * Instanciates the Google Chart from the chart constructor prop.
   * This should only be called once.
   */
  initializeChart() {
    const { googleChart: GoogleChartClass, chartData } = this.props;
    this.adapter = new ChartDataGoogleDataAdapter(chartData);
    this.chart = new GoogleChartClass(ReactDOM.findDOMNode(this));

    this.bindChartEvents();
    this.drawChart();
  },

  /**
   * Redraws the chart with data and options props.
   */
  drawChart() {
    this.chart.draw(this.adapter.toGoogleDataArray(), this.getOptions());
  },

  /**
   * Returns the google chart options
   * @return {Object}
   */
  getOptions() {
    return {
      ...this.adapter.toGoogleOptions(),
      ...this.props.options,
    };
  },

  /**
   * Binds event handlers to chart events
   */
  bindChartEvents() {
    google.visualization.events.addListener(this.chart, 'onmousemove', this.handleChartMouseMove);
    google.visualization.events.addListener(this.chart, 'select', this.handleChartSelect);
    google.visualization.events.addListener(this.chart, 'onmouseover', this.handleChartMouseOver);
    google.visualization.events.addListener(this.chart, 'onmouseout', this.handleChartMouseOut);
  },

  /**
   * Called when the mouse moves over the chart
   * Keeps track of what element the mouse is currently hovering
   * @param {Event} e
   */
  handleChartMouseMove(e) {
    this._prevTargetID = this._targetID;
    this._targetID = e.targetID;
  },

  /**
   * Called when a chart data point or category is selected
   * @param {Event} e
   */
  handleChartSelect(e) {
    if (!this.props.onChartSelect) {
      return;
    }

    const filter = this.adapter.selectionToDataKeys(e);
    const data = this.props.chartData.filterData(filter);

    this.props.onChartSelect(data);
  },

  /**
   * Called when the mouse enters a chart data point
   * @param {Event} e
   */
  handleChartMouseOver(e) {
    const { onChartMouseOver, options: { tooltip }} = this.props;
    if (!onChartMouseOver || this._targetID.indexOf('legendentry') === 0) {
      // Don't execute mouseOver when the hovered element is the legend
      return;
    }

    const filter = this.adapter.selectionToDataKeys(e, {
      filterSeries: tooltip && !tooltip.showWholeCategory,
    });
    const data = this.props.chartData.filterData(filter);

    this.props.onChartMouseOver(data);
  },

  /**
   * Called when the mouse leaves a chart data point
   */
  handleChartMouseOut() {
    if (!this.props.onChartMouseOut || this._prevTargetID.indexOf('legendentry') === 0) {
      // Don't execute mouseOut when the previously hovered element is the legend
      return;
    }

    this.props.onChartMouseOut();
  },

  render() {
    return (
      <div {..._.omit(this.props, 'children', 'options', 'chartData', 'chart', 'onChartMouseOut', 'onChartMouseOver')} />
    );
  },

});


const computeTooltipDataPoint = (hoverPart, chartData) => {
  const serieLabel = chartData.getDimensionByIndex(0).get('label');
  const serieValue = hoverPart.keySeq().get(0).valueSeq().get(0);
  const categoryLabel = chartData.getDimensionByIndex(1).get('label');
  const categoryValue = hoverPart.keySeq().get(0).valueSeq().get(1);

  const groups = [
    [ categoryLabel, categoryValue ],
    [ serieLabel, serieValue ],
  ];
  const metrics = [[ 'Total', hoverPart.valueSeq().get(0) ]];

  return { groups, metrics };
};

const computeTooltipDataCategory = (hoverPart, chartData) => {
  const categoryLabel = chartData.getDimensionByIndex(1).get('label');
  const categoryValue = hoverPart.keySeq().get(0).valueSeq().get(1);

  const groups = [[ categoryLabel, categoryValue ]];
  const metrics = hoverPart
    .mapKeys(key => key.valueSeq().get(0))
    .entrySeq()
    .toArray();

  return { groups, metrics };
};

const DEFAULT_TOOLTIP = (hoverPart, chartData, options) => {
  const computeData = options.tooltip && options.tooltip.showWholeCategory ? computeTooltipDataCategory
                    : computeTooltipDataPoint;
  return (
    <TooltipTable
      {...computeData(hoverPart, chartData)}
    />
  );
};

export default class GoogleChart extends React.Component {

  static displayName = 'GoogleChart';

  static propTypes = {
    chartData: React.PropTypes.instanceOf(ChartData).isRequired,
    tooltip: PropTypes.func,
    options: PropTypes.object,
  }

  static defaultProps = {
    tooltip: DEFAULT_TOOLTIP,
  }

  constructor(props) {
    super(props);
    this.state = {
      hoverPart: null,
    };
  }

  handleChartPartEnter(data) {
    this.setState({
      hoverPart: data,
    });
  }

  handleChartPartOut() {
    this.setState({
      hoverPart: null,
    });
  }

  render() {
    const { hoverPart } = this.state;
    const showTooltip = !!hoverPart;

    return (
      <div className="GoogleChart">
        <FollowCursor
          hasOverlay={showTooltip}
          renderOverlay={this.renderTooltip.bind(this)}
        >
          <GoogleChartBase
            onChartMouseOver={this.handleChartPartEnter.bind(this)}
            onChartMouseOut={this.handleChartPartOut.bind(this)}
            { ...this.props }
            options={{
              ...this.props.options,
              tooltip: {
                trigger: 'none',
                ...this.props.options.tooltip,
              },
            }}
          />
        </FollowCursor>
      </div>
    );
  }

  renderTooltip(overPart) {
    const { tooltip, chartData, options } = this.props;
    const { hoverPart } = this.state;

    return (
      <Tooltip className="GoogleChart-tooltip">
        { tooltip(hoverPart, chartData, options) }
      </Tooltip>
    );
  }
}

export default GoogleChart;
