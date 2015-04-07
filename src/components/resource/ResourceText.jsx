'use strict';

import React, {PropTypes} from 'react';
import HelpTooltip from './HelpTooltip';
import AdminMenu from './AdminMenu';
import classNames from 'classnames';

import './ResourceText.scss';

const ResourceText = React.createClass({

  displayName: 'ResourceText',

  propTypes: {
    className: PropTypes.string,
    resourceText: PropTypes.shape({
      text: PropTypes.string,
      description: PropTypes.string,
      editUrl: PropTypes.string,
    }).isRequired,
    isAdmin: PropTypes.bool,
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
