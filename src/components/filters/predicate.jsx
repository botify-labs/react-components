import React from 'react';

import PredicateBaseInput from './PredicateBaseInput';
import { getDefaultValue } from '../../mixins/InputMixin';

/**
 * Creates a predicate input component class
 * @param  {String}                  displayName
 * @param  {Array<ComponentOption>}  options.predicateOptions
 *                                   List of predicate filter predicate options this input accepts
 * @param  {Any}                     options.defaultValue
 *                                   Default value of the predicate input
 * @return {Function}                The new predicate filter input component class
 */
export function createPredicateInput(displayName, { predicateOptions, defaultValue }) {
  if (!defaultValue) {
    defaultValue = {
      predicateId: predicateOptions[0].id,
      predicateInputValue: getDefaultValue(predicateOptions[0].input),
    };
  }

  let PredicateFilterType = React.createClass({

    displayName,

    statics: {
      __isPredicateInput: true,
      predicateOptions,
      getDefaultValue() {
        return defaultValue;
      },
    },

    render() {
      return (
        <PredicateBaseInput
          {...this.props}
          predicateOptions={predicateOptions}
          />
      );
    },

  });

  return PredicateFilterType;
}

export function isPredicateInput(type) {
  return type.__isPredicateInput;
}
