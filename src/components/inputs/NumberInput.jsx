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

  _handleChange(value) {
    this.requestChange({ $set: parseFloat(value) });
  },

  render() {
    let { className, ...otherProps } = this.props;
    return (
      <input
        {...otherProps}
        className={classNames('NumberInput', className)}
        valueLink={this.link(this.getValue(), this._handleChange)}
        type="number"
        />
    );
  },

});

export default NumberInput;
