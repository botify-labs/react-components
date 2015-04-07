'use strict';

import React from 'react/addons';
import HelpTooltip from './HelpTooltip';
import AdminMenu from './AdminMenu';
import classNames from 'classnames';

import 'font-awesome/css/font-awesome.css';
import './ResourceText.scss'


const ResourceText = React.createClass({

  displayName: 'ResourceText',

  propTypes: {
    className: React.PropTypes.string,
    resourceText: React.PropTypes.shape({
      text: React.PropTypes.string,
      description: React.PropTypes.string,
      editUrl: React.PropTypes.string,
    }).isRequired,
    isAdmin: React.PropTypes.bool,
  },

  render() {
    return (
      <div className={classNames(this.props.className, 'ResourceText')}>

        {this.props.resourceText.text &&
          <span className="ResourceText-text">
            {this.props.resourceText.text}
          </span>
        }

        {this.props.resourceText.description &&
          <HelpTooltip className="ResourceText-helpTooltip">
            <span dangerouslySetInnerHTML={{__html: this.props.resourceText.description}} />
          </HelpTooltip>
        }

        {this.props.isAdmin &&
          <AdminMenu className="ResourceText-adminMenu"
                     resourceText={this.props.resourceText}/>
        }

      </div>
    );
  }
});


export default ResourceText;
