import React, { PropTypes } from 'react';
import cx from 'classnames';

import InputMixin from '../../mixins/InputMixin';


const StringInput = React.createClass({

  displayName: 'StringInput',

  propTypes: {
    className: PropTypes.string,
  },

  mixins: [
    InputMixin(PropTypes.string),
  ],

  render() {
    let { className, ...otherProps } = this.props;

    return (
      <input
        {...otherProps}
        className={cx('StringInput', className)}
        type="text"
        />
    );
  },

});

export default StringInput;
