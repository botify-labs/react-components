import React, { PropTypes } from 'react';
import classNames from 'classnames';
import InputMixin from '../../mixins/InputMixin';

// Input that only emits change on blur
const Input = React.createClass({

  displayName: 'Input',

  propTypes: {
    className: PropTypes.string,
  },

  mixins: [
    InputMixin(PropTypes.string),
  ],

  getInitialState() {
    return {
      hasFocus: false,
      value: null,
    };
  },

  _getTemporaryValue() {
    let { hasFocus, value } = this.state;
    if (hasFocus) {
      return value;
    }
    return this.getValue();
  },

  _handleFocus() {
    this.setState({
      hasFocus: true,
      value: this.getValue(),
    });
  },

  _handleBlur() {
    let { value } = this.state;
    this.setState({
      hasFocus: false,
      value: null,
    });
    this.requestChange({ $set: value });
  },

  _handleChange(value) {
    this.setState({ value });
  },

  render() {
    let { className, ...otherProps } = this.props;

    return (
      <input
        {...otherProps}
        className={classNames('Input', className)}
        onFocus={this._handleFocus}
        onBlur={this._handleBlur}
        valueLink={this.link(this._getTemporaryValue(), this._handleChange)}
      />
    );
  },

});

export default Input;
