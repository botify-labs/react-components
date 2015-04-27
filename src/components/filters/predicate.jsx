import React from 'react';

import PredicateBaseInput from './PredicateBaseInput';

/**
 * Creates a predicate input component class
 * @param  {String}                  displayName
 * @param  {Array<ComponentOption>}  options.predicateOptions
 *                                   List of predicate filter predicate options this type accepts
 * @param  {Any}                     options.defaultValue
 *                                   Default value of the predicate input
 * @return {Function}                The new predicate filter type component class
 */
export function createPredicateInput(displayName, { predicateOptions, defaultValue }) {
  let PredicateFilterType = React.createClass({

    displayName,

    statics: {
      getInitialValue(prevInput, prevValue) {
        // Conserve value when transitioning from this type to this type, otherwise set
        // default value
        return prevInput === this ? prevValue : defaultValue;
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
