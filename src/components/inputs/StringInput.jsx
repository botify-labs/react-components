import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Input from './Input';

const StringInput = React.createClass({

  displayName: 'StringInput',

  propTypes: {
    className: PropTypes.string,
  },

  render() {
    let { className, ...otherProps } = this.props;

    return (
      <Input
        {...otherProps}
        className={classNames('StringInput', className)}
        type="text"
        />
    );
  },

});

export default StringInput;
