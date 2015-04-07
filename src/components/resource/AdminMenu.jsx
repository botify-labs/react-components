'use strict';

import React from 'react/addons';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import classNames from 'classnames';

import 'font-awesome/css/font-awesome.css';
import './AdminMenu.scss';


const AdminMenu = React.createClass({

  displayName: 'AdminMenu',

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
    var title = <i className='fa fa fa-puzzle-piece'></i>;
    return (
      <DropdownButton className={classNames(this.props.className, 'AdminMenu', 'transparent')}
                      title={ title } noCaret="true">
        <MenuItem eventKey='1' href={ this.props.resourceText.editUrl }>
          <i className="MenuItem-icon fa fa-pencil-square-o"></i>
          Edit Text
        </MenuItem>
      </DropdownButton>
    );
  }
});


export default AdminMenu;
