import React from 'react';

/**
 * Renders a 2xN table from its props
 * Primary purpose is to represent chart data in tooltips
 */
const TooltipTable = React.createClass({

  displayName: 'TooltipTable',

  propTypes: {
    // Data rows are separated in two categories: groups and metrics.
    // Their format is the same, they only differ in style.
    groups: React.PropTypes.arrayOf(React.PropTypes.array), // [[label, value], ...]
    metrics: React.PropTypes.arrayOf(React.PropTypes.array),
  },

  render() {
    return (
      <div className="TooltipTable">
        <table>
          <tbody className="TooltipTable-groups">
            {this.props.groups && this.props.groups.map(this._renderRow)}
          </tbody>
          <tbody className="TooltipTable-metrics">
            {this.props.metrics && this.props.metrics.map(this._renderRow)}
          </tbody>
        </table>
      </div>
    );
  },

  _renderRow(row, idx) {
    return (
      <tr key={idx} className="TooltipTable-cell">
        <td className="TooltipTable-cell-label">
          {row[0]}
        </td>
        <td className="TooltipTable-cell-value">
          {row[1]}
        </td>
      </tr>
    );
  },

});

export default TooltipTable;
