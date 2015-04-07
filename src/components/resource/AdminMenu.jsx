'use strict';

import React from 'react/addons';
import classNames from 'classnames';

import 'font-awesome/css/font-awesome.css';


const AdminMenu = React.createClass({

  displayName: 'AdminMenu',

  propTypes: {
    resourceTextDescription: React.PropTypes.shape({
      text: React.PropTypes.string,
      description: React.PropTypes.string,
      editUrl: React.PropTypes.string,
    }).isRequired,
  },

  render() {
  }
});


export default AdminMenu;
