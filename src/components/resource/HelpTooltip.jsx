import React, {PropTypes} from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import classNames from 'classnames';

const HelpTooltip = React.createClass({

  displayName: 'HelpTooltip',

  propTypes: {
    className: PropTypes.string,
    children: PropTypes.node,
  },

  render() {
    let tooltip = <Tooltip>{this.props.children}</Tooltip>;

    return (
      //@TODO tooltip trigger should be hover and should stayed visible when user mouse is over the tooltip.
      <OverlayTrigger trigger="click" placement="top" overlay={tooltip} delayShow={0} delayHide={1000}>
        <span className={classNames(this.props.className, 'HelpTooltip')}>
          <i className="fa fa-question-circle"></i>
        </span>
      </OverlayTrigger>
    );
  },

});

export default HelpTooltip;
