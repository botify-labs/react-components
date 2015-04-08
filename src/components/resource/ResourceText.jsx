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
  },

  render() {
    let {className, resourceText, ...otherProps} = this.props;
    return (
      <div className={classNames(className, 'ResourceText')} {...otherProps}>

        {resourceText.text &&
          <span className="ResourceText-text">
            {resourceText.text}
          </span>
        }

        {resourceText.description &&
          <HelpTooltip className="ResourceText-helpTooltip">
            <span dangerouslySetInnerHTML={{__html: resourceText.description}} />
          </HelpTooltip>
        }

        {resourceText.editUrl &&
          <AdminMenu className="ResourceText-adminMenu"
                     resourceText={resourceText}/>
        }

      </div>
    );
  }

});

export default ResourceText;
