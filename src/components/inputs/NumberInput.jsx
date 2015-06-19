import React, { PropTypes } from 'react';
import classNames from 'classnames';
import InputMixin from '../../mixins/InputMixin';

const NumberInput = React.createClass({

  displayName: 'NumberInput',

  mixins: [
    InputMixin(PropTypes.number),
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
    this.requestChange({ $set: parseFloat(value) });
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
        onFocus={this._handleFocus}
        onBlur={this._handleBlur}
        className={classNames('NumberInput', className)}
        valueLink={this.link(this._getTemporaryValue(), this._handleChange)}
        type="number"
        />
    );
  },

});

export default NumberInput;
