import React, {PropTypes} from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import classNames from 'classnames';

import './AdminMenu.scss';

const AdminMenu = React.createClass({

  displayName: 'AdminMenu',

  propTypes: {
    className: PropTypes.string,
    resourceText: PropTypes.shape({
      text: PropTypes.string,
      description: PropTypes.string,
      editUrl: PropTypes.string,
    }).isRequired,
  },

  render() {
    const title = <i className="fa fa-puzzle-piece"></i>;
    return (
      <DropdownButton
        id="AdminMenu"
        className={classNames(this.props.className, 'AdminMenu', 'transparent')}
        title={title} noCaret
      >
        <MenuItem className="AdminMenu-editText" eventKey="1" href={this.props.resourceText.editUrl}>
          <i className="MenuItem-icon fa fa-pencil-square-o"></i>
          Edit Text
        </MenuItem>
      </DropdownButton>
    );
  },

});

export default AdminMenu;
