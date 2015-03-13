import React from 'react/addons';

import './tooltip-data.scss';

var TooltipData = React.createClass({

  displayName: 'TooltipData',

  propTypes: {
    groups: React.PropTypes.arrayOf(React.PropTypes.array),
    metrics: React.PropTypes.arrayOf(React.PropTypes.array)
  },

  render() {
    return (
      <div className="TooltipData">
        <table>
          <tbody className="TooltipData-groups">
            {this.props.groups && this.props.groups.map((group, idx) => (
              <tr key={idx} className="TooltipData-cell">
                <td className="TooltipData-cell-label">
                  {group[0]}
                </td>
                <td className="TooltipData-cell-value">
                  {group[1]}
                </td>
              </tr>
            ))}
          </tbody>
          <tbody className="TooltipData-metrics">
            {this.props.metrics && this.props.metrics.map((metric, idx) => (
              <tr key={idx} className="TooltipData-cell">
                <td className="TooltipData-cell-label">
                  {metric[0]}
                </td>
                <td className="TooltipData-cell-value">
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

export default TooltipData;
