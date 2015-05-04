import React from 'react';

import FilterBaseInput from './FilterBaseInput';

export function createFilterInput(displayName, { areaOptions, defaultValue }) {
  let FilterInput = React.createClass({

    displayName,

    statics: {
      areaOptions,
      getDefaultValue() {
        return defaultValue;
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
