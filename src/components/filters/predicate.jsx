import React from 'react';

import PredicateFilterBaseInput from './PredicateFilterBaseInput';

/**
 * Creates a predicate filter type component class
 * @param  {String}                  displayName
 * @param  {Array<ComponentOption>}  options.predicateOptions
 *                                   List of predicate filter predicate options this type accepts
 * @param  {Any}                     options.defaultValue
 *                                   Default value of the predicate input
 * @return {Function}                The new predicate filter type component class
 */
export function createPredicateFilterInput(displayName, { predicateOptions, defaultValue }) {
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
        <PredicateFilterBaseInput
          {...this.props}
          predicateOptions={predicateOptions}
          />
      );
    },

  });

  return PredicateFilterType;
}
