import React, { PropTypes } from 'react';

import TopCompoundFilter from '../src/components/filters/TopCompoundFilter';
import Select from '../src/components/inputs/Select';
import StringInput from '../src/components/inputs/StringInput';
import NumberInput from '../src/components/inputs/NumberInput';

import InputMixin, { getDefaultValue } from '../src/mixins/InputMixin';
import InputValidator from '../src/components/inputs/InputValidator';
import { createPredicateInput } from '../src/components/filters/predicate';

// Example validated input: valid when v >= 0
const PositiveNumberInput = InputValidator(NumberInput, v => v >= 0);

// Predicate inputs take a list of predicate options
const StringPredicateInput = createPredicateInput('StringPredicateInput', {
  predicateOptions: [
    {
      id: 'equals',
      label: 'equals',
      input: StringInput,
    },
    {
      id: 'contains',
      label: 'contains',
      input: StringInput,
    },
    {
      id: 'starts_with',
      label: 'starts with',
      input: StringInput,
    },
  ],
});

const NumberPredicateInput = createPredicateInput('NumberPredicateInput', {
  predicateOptions: [
    {
      id: 'greater_than',
      label: 'greater than',
      input: PositiveNumberInput,
    },
  ],
});

// Example option input that just wraps a Select
const ExistsFilterOptionInput = React.createClass({

  displayName: 'ExistsFilterOptionInput',

  statics: {
    getDefaultValue() {
      return 'exist';
    },
  },

  render() {
    return (
      <Select
        {...this.props}
        options={[
          {
            id: 'exist',
            label: 'Exists',
          },
          {
            id: 'not_exist',
            label: 'Doesn\'t exist',
          },
        ]}
      />
    );
  },

});

const filterOptions = [
  {
    isGroup: true,
    id: 'group_1',
    label: 'Group 1',
    options: [
      {
        id: 'host',
        label: 'Host',
        input: StringPredicateInput,
      },
      {
        id: 'protocol',
        label: 'Protocol',
        input: StringPredicateInput,
      },
      {
        id: 'outlinks_nb',
        label: 'Number of Outlinks',
        input: NumberPredicateInput,
      },
    ],
  },
  {
    id: 'previous_thing',
    label: 'Previous thing',
    input: ExistsFilterOptionInput,
  },
];

// A filter input can implement `getDefaultValue` and the `InputMixin` mixin
const FilterInput = React.createClass({
  displayName: 'FilterInput',

  statics: {
    getDefaultValue() {
      return {};
    },
  },

  mixins: [
    InputMixin(PropTypes.shape({
      optionId: PropTypes.string,
      optionInputValue: PropTypes.any,
    })),
  ],

  render() {
    let { optionId } = this.getValue();
    let option = Select.getOption(filterOptions, optionId);

    return (
      <div>
        <Select
          options={filterOptions}
          nullLabel="Select a filter"
          valueLink={this.link(optionId, newOptionId => {
            let newOption = Select.getOption(filterOptions, newOptionId);
            this.requestChange({
              optionId: { $set: newOptionId },
              // When switching option, we also want to set an initial value to our option's input
              optionInputValue: { $set: getDefaultValue(newOption.input) },
            });
          })}
        />
        {option &&
          <option.input valueLink={this.linkValue('optionInputValue')} />
        }
      </div>
    );
  },
});

// Example `TopCompoundFilter` wrapper that just passes a custom `filterInput` and stores
// value in state
const ControlledTopCompoundFilter = React.createClass({

  displayName: 'ControlledTopCompoundFilter',

  getInitialState() {
    return {
      operatorId: 'and',
      compoundFilters: [
        {
          operatorId: 'and',
          filters: [],
        },
      ],
    };
  },

  render() {
    return (
      <TopCompoundFilter
        filterInput={FilterInput}
        valueLink={{ value: this.state, requestChange: (newState) => this.setState(newState) }}
        />
    );
  },

});

React.render(
  <ControlledTopCompoundFilter />
, document.getElementById('container'));
