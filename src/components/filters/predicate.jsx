import React from 'react';

import PredicateFilterBaseType from './PredicateFilterBaseType';

/**
 * Creates a predicate filter type component class
 * @param  {String}                  displayName
 * @param  {Array<ComponentOption>}  options.operatorOptions
 *                                   List of predicate filter operator options this type accepts
 * @param  {Any}                     options.defaultValue
 *                                   Default value of the operator input
 * @return {Function}                The new predicate filter type component class
 */
export function createPredicateFilterType(displayName, { operatorOptions, defaultValue }) {
  let PredicateFilterType = React.createClass({

    displayName,

    statics: {
      getInitialValue(prevType, prevValue) {
        // Conserve value when transitioning from this type to this type, otherwise set
        // default value
        return prevType === this ? prevValue : defaultValue;
      },
    },

    render() {
      return (
        <PredicateFilterBaseType
          {...this.props}
          operatorOptions={operatorOptions}
          />
      );
    },

  });

  return PredicateFilterType;
}
