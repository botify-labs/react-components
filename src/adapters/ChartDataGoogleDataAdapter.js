
import { List, Map } from 'immutable';

/**
 * @property {Map} _axes Map of axes relative dimension key
 * @param {[type]} chartData [description]
 */
class ChartDataGoogleDataAdapter{
  constructor(chartData) {
    this.chartData = chartData;
    this._axesKey = Map();
    return this;
  }

  /**
   * @param {Map} options
   * {
   *   axes: Map<AxisName, DimensionsKey>  AxisName € ['categories, series']
   *   filters: Map<DimensionsKey, GroupKey>
   * }
   * @return {Array<Array>}
   * @note
   *  - Data is sum on unviable dimensions unless filters options are provided
   *  - If axes option is not provided, it uses the last two dimensions in the ChartData
   */
  toGoogleDataArray(options = Map()) {
    this._setAxes(options.get('axes'));
    var valuesArray = this._getGoogleValuesArray(options.get('filters'));

    var [categoriesLabels, seriesLabels] = this._getAxesLabels();

    //Merge valuesArray and labels in the google shitty way
    //                     series
    //                S1 S2 S3 S4 S5 S6
    //            C1  X  X  X  X  X  X
    //            C2  X              X
    // categories C3  X  ValuesArray X
    //            C4  X              X
    //            C5  X  X  X  X  X  X
    var googleDataArray = List();
    googleDataArray = googleDataArray.push(seriesLabels.unshift(''));
    categoriesLabels.forEach((label, i) => {
      googleDataArray = googleDataArray.push(valuesArray.get(i).unshift(label));
    });

    return google.visualization.arrayToDataTable(googleDataArray.toJS());
  }

  toGoogleOptions(percentage) {
    /*var googleOptions = this.chartData.options.merge(Map(  //DEFAULT OPTIONS TO BE PUT IN CHART COMPONENT
      {
        series: {},
        vAxis: {
            format: percentage ? '#,###.#%' : '#,###.#',
        },
        hAxis: {
            format: percentage ? '#,###.#%' : '#,###.#',
        },
        tooltip: {
            trigger: "none"
        }
      }
    ));*/
    var googleOptions = Map();

    googleOptions.set('series', this._getSeries().get('groups').map((group, key) => {
      return Map({color: group.get('color')});
    }).toList());

    return googleOptions;
  }

  /**
   * Converts Google Chart selection to DataKeys
   * @param  {Object} Object {row, column}
   * @return {DataKeys}
   */
  selectionToDataKeys({row, column}) {
    var filter = Map();

    // Series are indexed starting from 1, while categories are indexed starting from 0
    var series = this._getSeries();
    var serieKey = series.get('groups').keySeq().get(column - 1);
    filter = filter.set(series.get('key'), serieKey);
    if (row !== null) {
      var categories = this._getCategories();
      var categoryKey = categories.get('groups').keySeq().get(row);
      filter = filter.set(categories.get('key'), categoryKey);
    }

    return filter;
  }

  _getCategories() {
    return this._getAxis(this._axesKey.get('categories'));
  }
  _getSeries() {
    return this._getAxis(this._axesKey.get('series'));
  }

  _getGoogleValuesArray(filters) {
    var googleValuesArray = this._getEmptyGoogleValuesArray(),
        data = this.chartData.filterData(filters),
        categories = this._getCategories(),
        series = this._getSeries();

    //Iterate on each data and set it's value in the proper cell
    data.map((value, key) => {
      var xIndex = categories.get('groupKeys').indexOf(key.get(categories.get('key')));
      var yIndex = series.get('groupKeys').indexOf(key.get(series.get('key')));
      if (xIndex === -1 || yIndex === -1) {
        throw new Error('data [' + key + ',' + value + '] have a dimension group\'s key undefined');
      }

      googleValuesArray = googleValuesArray.setIn(
        [xIndex, yIndex],
        value.get(0) + googleValuesArray.getIn([xIndex, yIndex])  //Add to existing value
      );
    });
    return googleValuesArray;
  }

  _getEmptyGoogleValuesArray() {
    var googleValuesArray = List();
    for (var x = 0; x < this._getCategories().get('groupKeys').size; x++) {
      googleValuesArray = googleValuesArray.push(new List());
      for (var y = 0; y < this._getSeries().get('groupKeys').size; y++) {
        googleValuesArray = googleValuesArray.setIn([x, y], 0);
      }
    }
    return googleValuesArray;
  }

  /**
   * categories axis is the last dimension unless a specific option have been set
   * series axis is the last-1 dimension unless a specific option have been set
   */
  _setAxes(axisKeys = Map()) {
    this._axesKey = this._axesKey.set('categories',
      axisKeys.get('categories') || this.chartData.getDimensionKeyByIndex(0, true)
    );

    this._axesKey = this._axesKey.set('series',
      axisKeys.get('series') || this.chartData.getDimensionKeyByIndex(1, true)
    );
  }

  /**
   * Return ChartData relative dimension and precomute helpers
   * @param {Any} axisKey
   * @return {Dimension}
   */
  _getAxis(axisKey) {
    var dimension = this.chartData.getDimension(axisKey);
    return dimension
      .set('key', axisKey)
      .set('groupKeys', dimension.get('groups').keySeq());
  }


  /*_getAxisInfo(dimensionKey){
    var info = Map();
    info = info.set('key', dimensionKey);
    info = info.set('value', this.chartData.getDimension(dimensionKey));
    info = info.set('groupKeys', info.get('value').get('groups').keySeq());
    return info;
  }*/
  _getAxesLabels() {
    return [
      this._getCategories().get('groups').map((group, key) => group.get('label') || key).toList(),
      this._getSeries().get('groups').map((group, key) => group.get('label') || key).toList(),
    ];
  }
}

export default ChartDataGoogleDataAdapter;
