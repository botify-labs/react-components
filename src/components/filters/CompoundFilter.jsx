import React, { PropTypes } from 'react';
import _ from 'lodash';
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
  filters: PropTypes.arrayOf(PropTypes.any),
});

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

  _handleFilterChange(idx, filter) {
    this.requestChange({
      filters: {
        $splice: [
          [idx, 1, filter],
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

    // Append a dummy filter with no `filterId` to the list of filters.
    // When the user selects a `filterId` for the dummy, we consider that a new filter was added to the list.
    if (filters.length === 0 || _.last(filters).filterId) {
      filters = filters.concat([getDefaultValue(FilterInput)]);
    }

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
              className="CompoundFilter-remove btn"
              onClick={onRemove}
              >
              Remove
            </button>
          }
        </div>
        <div className="CompoundFilter-filters">
          {filters.map((filter, idx) => (
            <FilterInput
              key={idx}
              // The custom filter input should call its `onRemove` prop to request removal
              // Dummy filters cannot request removal
              onRemove={idx !== filters.length - 1 ? this._handleFilterRemove.bind(null, idx) : null}
              valueLink={this.link(filter, this._handleFilterChange.bind(null, idx))}
              />
          ))}
        </div>
      </div>
    );
  },

});

CompoundFilter.PropTypes = { value: valuePropType };

export default CompoundFilter;
