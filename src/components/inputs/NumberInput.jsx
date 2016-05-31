import React, { PropTypes } from 'react';
import cx from 'classnames';
import _ from 'lodash';

import InputMixin from '../../mixins/InputMixin';


const NumberInput = React.createClass({

  displayName: 'NumberInput',

  propTypes: {
    className: PropTypes.string,
  },

  mixins: [
    InputMixin(PropTypes.number),
  ],

  getInitialState() {
    return {
      trailingPoint: false,
    };
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
    const value = _.isNumber(this.getValue()) && !_.isNaN(this.getValue()) ? `${this.getValue()}${trailingPoint ? '.' : ''}` : '';

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
