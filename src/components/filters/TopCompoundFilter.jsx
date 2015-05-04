import React, { PropTypes } from 'react/addons';

import CompoundFilter from './CompoundFilter';
import ButtonSelect from '../inputs/ButtonSelect';

import InputMixin from '../../mixins/InputMixin';

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

const defaultOperator = 'and';

const TopCompoundFilter = React.createClass({

  displayName: 'TopCompoundFilter',

  mixins: [
    InputMixin(PropTypes.shape({
      // Id of the selected operator in `OPERATOR_OPTIONS`
      operatorId: PropTypes.oneOf(OPERATOR_OPTIONS.map((operator) => operator.id)),
      // List of the values of the `CompoundFilter` children
      compoundFilters: PropTypes.arrayOf(CompoundFilter.PropTypes.value),
    })),
  ],

  propTypes: {
    filterInput: PropTypes.func,
  },

  _handleCompoundFilterChange(idx, value) {
    this.requestChange({
      compoundFilters: {
        [idx]: { $set: value },
      },
    });
  },

  _handleAddCompoundFilter() {
    this.requestChange({
      compoundFilters: {
        $push: [
          {
            operatorId: defaultOperator,
            filters: [],
          },
        ],
      },
    });
  },

  _handleRemoveCompoundFilter(idx) {
    this.requestChange({
      compoundFilters: {
        $splice: [[idx, 1]],
      },
    });
  },

  render() {
    let { filterInput } = this.props;
    let { compoundFilters } = this.getValue();

    return (
      <div className="TopCompoundFilter">
        <div className="TopCompoundFilter-filters">
          {compoundFilters.map((compoundFilter, idx) => (
            <div key={idx} className="TopCompoundFilter-filter">
              {/* The first compound filter shouldn't display the operator select, and isn't removable */}
              {idx > 0 &&
                <ButtonSelect
                  className="TopCompoundFilter-operatorSelect"
                  options={OPERATOR_OPTIONS}
                  valueLink={this.linkValue('operatorId')}
                  />
              }
              <CompoundFilter
                filterInput={filterInput}
                onRemove={compoundFilters.length > 1 ? this._handleRemoveCompoundFilter.bind(null, idx) : null}
                valueLink={this.link(compoundFilter, this._handleCompoundFilterChange.bind(null, idx))}
                />
            </div>
          ))}
        </div>
        <button
          className="TopCompoundFilter-addCompoundFilter"
          onClick={this._handleAddCompoundFilter}
          >
          +
        </button>
      </div>
    );
  },

});

export default TopCompoundFilter;
