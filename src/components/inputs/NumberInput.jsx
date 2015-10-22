import React, { PropTypes } from 'react';
import cx from 'classnames';

import InputMixin from '../../mixins/InputMixin';


const NumberInput = React.createClass({

  displayName: 'NumberInput',

  mixins: [
    InputMixin(PropTypes.number),
  ],

  getInitialState() {
    return {
      trailingPoint: false,
    };
  },

  propTypes: {
    className: PropTypes.string,
  },

  handleChange(value) {
    this.setState({
      trailingPoint: value[value.length - 1] === '.',
    });
    this.requestChange({ $set: parseFloat(value) });
  },

  render() {
    const { className, ...otherProps } = this.props;
    const { trailingPoint } = this.state;
    const value = `${this.getValue()}${trailingPoint ? '.' : ''}`;

    return (
      <input
        {...otherProps}
        className={cx('NumberInput', className)}
        valueLink={this.link(value, this.handleChange)}
        type="number"
      />
    );
  },

});

export default NumberInput;
