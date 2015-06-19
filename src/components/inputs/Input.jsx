import React, { PropTypes } from 'react';
import classNames from 'classnames';
import InputMixin from '../../mixins/InputMixin';

const Input = React.createClass({

  displayName: 'Input',

  mixins: [
    InputMixin(PropTypes.string),
  ],

  propTypes: {
    className: PropTypes.string,
  },

  getInitialState() {
    return {
      hasFocus: false,
      value: null,
    };
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

  _getTemporaryValue() {
    let { hasFocus, value } = this.state;
    if (hasFocus) {
      return value;
    }
    return this.getValue();
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
