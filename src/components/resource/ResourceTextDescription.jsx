'use strict';

import React from 'react/addons';
import HelpTooltip from './HelpTooltip';
import AdminMenu from './AdminMenu';
import classNames from 'classnames';

import 'font-awesome/css/font-awesome.css';
import './ResourceTextDescription.scss'


const ResourceTextDescription = React.createClass({

  displayName: 'ResourceTextDescription',

  propTypes: {
    className: React.PropTypes.string,
    resourceTextDescription: React.PropTypes.shape({
      text: React.PropTypes.string,
      description: React.PropTypes.string,
      editUrl: React.PropTypes.string,
    }).isRequired,
    isAdmin: React.PropTypes.bool,
  },

  render() {
    return (
      <div className={classNames(this.props.className, 'ResourceTextDescription')}>

        {this.props.resourceTextDescription.text &&
          <span className="ResourceTextDescription-text">
            {this.props.resourceTextDescription.text}
          </span>
        }

        {this.props.resourceTextDescription.description &&
          <HelpTooltip className="ResourceTextDescription-helpTooltip">
            <span dangerouslySetInnerHTML={{__html: this.props.resourceTextDescription.description}} />
          </HelpTooltip>
        }

        {this.props.isAdmin &&
          <AdminMenu className="ResourceTextDescription-adminMenu"
                     resourceTextDescription={this.props.resourceTextDescription}
                     isAdmin={this.props.isAdmin}/>
        }

      </div>
    );
  }
});


export default ResourceTextDescription;
