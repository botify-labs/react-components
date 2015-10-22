import React, { PropTypes } from 'react';
import InputMixin from '../../mixins/InputMixin';


/**
 * Request Change only on child input Blur
 * @param {Component} input component to differ change
 * <!> Only Child must implement InputMixin
 */
const DifferChange = ComposedComponent => React.createClass({

  displayName: 'DifferChange',

  mixins: [
    InputMixin(PropTypes.any),
  ],

  propTypes: {
    className: PropTypes.string,
  },

  getInitialState() {
    return {
      hasFocus: false,
      tempValue: null,
    };
  },

  handleFocus() {
    this.setState({
      hasFocus: true,
      tempValue: this.getValue(),
    });
  },

  handleBlur() {
    const { tempValue } = this.state;
    this.setState({
      hasFocus: false,
      tempValue: null,
    });
    this.requestChange({ $set: tempValue });
  },

  handleChange(value) {
    this.setState({ tempValue: value });
  },

  getDifferedValue() {
    const { hasFocus, tempValue } = this.state;
    if (hasFocus) {
      return tempValue;
    }
    return this.getValue();
  },

  render() {
    const { className, ...otherProps } = this.props;

    return (
      <ComposedComponent
        {...otherProps}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        valueLink={this.link(this.getDifferedValue(), this.handleChange)}
      />
    );
  },

});

export default DifferChange;
