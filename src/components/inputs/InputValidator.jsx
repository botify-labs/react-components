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
      let defaultValue = getDefaultValue(Input);
      return { isValid: validator(defaultValue), inputValue: defaultValue };
    },
  },

  _handleChange(v) {
    let isValid = validator(v);
    this.requestChange({ $set: { inputValue: v, isValid } });
  },

  render() {
    let { className, ...otherProps } = _.omit(this.props, 'valueLink');
    let { isValid, inputValue } = this.getValue();
    return (
      <Input
        {...otherProps}
        className={classNames(className, isValid ? 'isValid' : 'isInvalid')}
        valueLink={{ value: inputValue, requestChange: this._handleChange }}
        />
    );
  },

});

InputValidator.isInputValidator = function(type) {
  return type.__isInputValidator;
};

export default InputValidator;
