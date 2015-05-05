import React, { PropTypes } from 'react';
import classNames from 'classnames';

const StringInput = React.createClass({

  displayName: 'StringInput',

  propTypes: {
    className: PropTypes.string,
  },

  render() {
    let { className, ...otherProps } = this.props;

    return (
      <input
        {...otherProps}
        className={classNames(className, 'form-control')}
        type="text"
        />
    );
  },

});

export default StringInput;
