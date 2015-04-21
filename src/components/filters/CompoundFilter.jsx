import React, { PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import Filter from './Filter';
import ButtonSelect from '../inputs/ButtonSelect';

import InputMixin from '../../mixins/InputMixin';
import { areaOptionShape } from '../../shapes/option';

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

const CompoundFilter = React.createClass({

  displayName: 'CompoundFilter',

  mixins: [
    InputMixin(PropTypes.shape({
      operator: PropTypes.oneOf(OPERATOR_OPTIONS.map((operator) => operator.id)),
      filters: PropTypes.arrayOf(PropTypes.any),
    }))
  ],

  propTypes: {
    className: PropTypes.string,
    areaOptions: PropTypes.arrayOf(areaOptionShape).isRequired,
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

export default CompoundFilter;
