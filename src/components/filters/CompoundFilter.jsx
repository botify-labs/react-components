import React, { PropTypes } from 'react';
import classNames from 'classnames';

import ButtonSelect from '../inputs/ButtonSelect';

import InputMixin, { getDefaultValue } from '../../mixins/InputMixin';

const OPERATOR_OPTIONS = [
  {
    id: 'and',
    label: 'AND',
  },
  {
    id: 'or',
    label: 'OR',
  },
];

const valuePropType = PropTypes.shape({
  // Id of the selected operator in `OPERATOR_OPTIONS`
  operatorId: PropTypes.oneOf(OPERATOR_OPTIONS.map((operator) => operator.id)),
  // List of the values of the children filter input components
  filters: PropTypes.arrayOf(PropTypes.shape({
    // Each filter should have a unique key, so that its component can be correctly reconciled
    // between renders.
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.any,
  })),
});

// The set of negative numeric id is reserved to the dummy filters created from within the component.
let uniqueDummyKey = -1;

const CompoundFilter = React.createClass({

  displayName: 'CompoundFilter',

  mixins: [
    InputMixin(valuePropType),
  ],

  propTypes: {
    className: PropTypes.string,
    // Custom filter input component class. Must implement the Controlled Input prop interface.
    // Will be passed `{ onRemove, valueLink }` as props.
    filterInput: PropTypes.func.isRequired,
    // If defined, call this when the compound filter should be removed
    onRemove: PropTypes.func,
  },

  _handleFilterChange(idx, key, value) {
    let { filters } = this.getValue();

    if (key === uniqueDummyKey) {
      // The dummy filter got assigned a value: it is now a proper filter.
      // Create a new unique id for the next dummy filter.
      uniqueDummyKey--;
    }

    this.requestChange({
      filters: {
        $splice: [
          [idx, 1, { key, value }]
        ],
      },
    });
  },

  _handleFilterRemove(idx) {
    this.requestChange({
      filters: {
        $splice: [
          [idx, 1],
        ],
      },
    });
  },

  render() {
    let { filterInput: FilterInput, className, onRemove } = this.props;
    let { filters } = this.getValue();

    // Append a dummy filter with a default value to the list of filters.
    // Dummy filters can request the creation of a proper filter by calling `requestChange` with a new value.
    filters = filters.concat([{
      key: uniqueDummyKey,
      value: getDefaultValue(FilterInput),
    }]);

    return (
      <div className={classNames('CompoundFilter', className)}>
        {/* Only display the operator select when there are more than one filter in the compound filter */}
        <div className="CompoundFilter-controls">
          <ButtonSelect
            className="CompoundFilter-operatorSelect"
            options={OPERATOR_OPTIONS}
            disabled={filters.length <= 1}
            valueLink={this.linkValue('operatorId')}
            />
          {onRemove &&
            <button
              className="CompoundFilter-remove"
              onClick={onRemove}
              >
              Remove
            </button>
          }
        </div>
        <div className="CompoundFilter-filters">
          {filters.map((filter, idx) => (
            <FilterInput
              key={filter.key}
              // The custom filter input should call its `onRemove` prop to request removal
              // Dummy filters cannot request removal
              onRemove={idx !== filters.length - 1 ? this._handleFilterRemove.bind(null, idx) : null}
              valueLink={this.link(filter.value, this._handleFilterChange.bind(null, idx, filter.key))}
              />
          ))}
        </div>
      </div>
    );
  },

});

CompoundFilter.PropTypes = { value: valuePropType };

export default CompoundFilter;
