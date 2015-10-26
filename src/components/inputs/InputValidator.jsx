import React, { PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { cloneStatics } from '../../utils';
import InputMixin, { getDefaultValue } from '../../mixins/InputMixin';

/**
 * Higher-order component that validates the value of its composed Input.
 * @param  {ReactClass} Input         Composed input, should implement InputMixin and can implement
 *                                    a `getDefaultValue()` static method
 * @param  {Function}   validator(v)  Validator function, should return a boolean that indicates
 *                                    whether the provided value is valid
 * @return {ReactClass}
 */
const InputValidator = (Input, validator) => React.createClass({

  displayName: 'InputValidator',

  mixins: [
    InputMixin(PropTypes.shape({
      inputValue: PropTypes.any,
      isValid: PropTypes.bool,
    })),
  ],

  statics: {
    ...cloneStatics(Input),
    __isInputValidator: true,
    getDefaultValue() {
      const defaultValue = getDefaultValue(Input);
      return { isValid: validator(defaultValue), inputValue: defaultValue };
    },
  },

  _handleChange(v) {
    const isValid = validator(v);
    this.requestChange({ $set: { inputValue: v, isValid } });
  },

  render() {
    const otherProps = _.omit(this.props, 'valueLink');
    const { isValid, inputValue } = this.getValue();

    return (
      <div className={classNames('InputValidator', `InputValidator--${isValid ? 'valid' : 'invalid'}`)}>
        <Input
          {...otherProps}
          valueLink={{ value: inputValue, requestChange: this._handleChange }}
          />
      </div>
    );
  },

});

InputValidator.isInputValidator = (type) => {
  return type.__isInputValidator;
};

export default InputValidator;
