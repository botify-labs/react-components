import React from 'react/addons';

import './tooltip-table.scss';

var TooltipTable = React.createClass({

  displayName: 'TooltipTable',

  propTypes: {
    groups: React.PropTypes.arrayOf(React.PropTypes.array),
    metrics: React.PropTypes.arrayOf(React.PropTypes.array)
  },

  render() {
    return (
      <div className="TooltipTable">
        <table>
          <tbody className="TooltipTable-groups">
            {this.props.groups && this.props.groups.map((group, idx) => (
              <tr key={idx} className="TooltipTable-cell">
                <td className="TooltipTable-cell-label">
                  {group[0]}
                </td>
                <td className="TooltipTable-cell-value">
                  {group[1]}
                </td>
              </tr>
            ))}
          </tbody>
          <tbody className="TooltipTable-metrics">
            {this.props.metrics && this.props.metrics.map((metric, idx) => (
              <tr key={idx} className="TooltipTable-cell">
                <td className="TooltipTable-cell-label">
                  {metric[0]}
                </td>
                <td className="TooltipTable-cell-value">
                  {metric[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },

});

export default TooltipTable;
