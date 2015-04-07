'use strict';

import React from 'react/addons';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import 'font-awesome/css/font-awesome.css';


const HelpTooltip = React.createClass({

  displayName: 'HelpTooltip',

  render() {
    let tooltip = <Tooltip>{this.props.children}</Tooltip>;

    return (
      //@TODO tooltip trigger should be hover and should stayed visible when user mouse is over the tooltip.
      <OverlayTrigger trigger='click' placement='top' overlay={tooltip} delayShow={0} delayHide={1000}>
        <i className="fa fa-question-circle"></i>
      </OverlayTrigger>
    );
  }
});

export default HelpTooltip;
