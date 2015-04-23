import React, { PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import Filter from './Filter';
import ButtonSelect from '../inputs/ButtonSelect';

import InputMixin from '../../mixins/InputMixin';

const OPERATOR_OPTIONS = [
  {
    id: 'and',
    label: 'AND'
  },
  {
    id: 'or',
    label: 'OR',
  }
];

const valuePropType = PropTypes.shape({
  // Id of the selected operator in `OPERATOR_OPTIONS`
  operator: PropTypes.oneOf(OPERATOR_OPTIONS.map((operator) => operator.id)),
  // List of the values of the children `Filter` components
  filters: PropTypes.arrayOf(Filter.PropTypes.value),
});

const CompoundFilter = React.createClass({

  displayName: 'CompoundFilter',

  mixins: [InputMixin(valuePropType)],

  propTypes: {
    className: PropTypes.string,
    // List of area options, see the `Filter` component
    areaOptions: Filter.PropTypes.areaOptions,
    // Default area id, see the `Filter` component
    defaultAreaId: PropTypes.string,
  },

  _handleFilterChange(idx, filter) {
    this.update({
      filters: {
        $splice: [
          [idx, 1, filter]
        ]
      }
    });
  },

  _handleFilterRemove(idx) {
    this.update({
      filters: {
        $splice: [
          [idx, 1]
        ]
      }
    });
  },

  render() {
    let { areaOptions, defaultAreaId, className } = this.props;
    let { filters } = this.getValue();

    // Append a dummy filter with no `filterId` to the list of filters.
    // When the user selects a `filterId` for the dummy, we consider that a new filter was added to the list.
    if (filters.length === 0 || _.last(filters).filterId) {
      filters = filters.concat([{
        areaId: defaultAreaId
      }]);
    }

    return (
      <div className={classNames('CompoundFilter', className)}>
        {/* Only display the operator select when there are more than one filter in the compound filter */}
        <ButtonSelect
          className="CompoundFilter-operatorSelect"
          options={OPERATOR_OPTIONS}
          disabled={filters.length <= 1}
          {...this.linkValue('operator')}
          />
        <div className="CompoundFilter-filters">
          {filters.map((filter, idx) => (
            <Filter
              key={idx}
              areaOptions={areaOptions}
              onRemove={this._handleFilterRemove.bind(null, idx)}
              {...this.link(filter, this._handleFilterChange.bind(null, idx))}
              />
          ))}
        </div>
      </div>
    );
  }

});

CompoundFilter.PropTypes = { value: valuePropType };

export default CompoundFilter;
