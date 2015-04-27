import React from 'react';

import FilterBaseInput from './FilterBaseInput';

export function createFilterInput(displayName, { areaOptions, defaultValue }) {
  let FilterInput = React.createClass({

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
        <FilterBaseInput
          {...this.props}
          areaOptions={areaOptions}
          />
      );
    },

  });

  return FilterInput;
}
