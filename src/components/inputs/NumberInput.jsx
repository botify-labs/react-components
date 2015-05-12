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

  render() {
    let { className, ...otherProps } = this.props;
    return (
      <input
        {...otherProps}
        className={classNames('NumberInput', className)}
        value={this.getValue()}
        onChange={e => this.requestChange({ $set: parseFloat(e.target.value) })}
        type="number"
        />
    );
  },

});

export default NumberInput;
