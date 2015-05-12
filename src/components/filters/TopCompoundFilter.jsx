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

let uniqueCompoundFilterKey = -1;

const TopCompoundFilter = React.createClass({

  displayName: 'TopCompoundFilter',

  mixins: [
    InputMixin(PropTypes.shape({
      // Id of the selected operator in `OPERATOR_OPTIONS`
      operatorId: PropTypes.oneOf(OPERATOR_OPTIONS.map((operator) => operator.id)),
      // List of the values of the `CompoundFilter` children
      compoundFilters: PropTypes.arrayOf(PropTypes.shape({
        // Each compound filter should have a unique key, so that its component can be correctly
        // reconciled between renders.
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        value: CompoundFilter.PropTypes.value,
      })),
    })),
  ],

  propTypes: {
    filterInput: CompoundFilter.propTypes.filterInput,
  },

  _handleCompoundFilterValueChange(idx, value) {
    this.requestChange({
      compoundFilters: {
        [idx]: { value: { $set: value } },
      },
    });
  },

  _handleAddCompoundFilter() {
    this.requestChange({
      compoundFilters: {
        $push: [
          {
            key: uniqueCompoundFilterKey--,
            value: {
              operatorId: defaultOperator,
              filters: [],
            },
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
            <div key={compoundFilter.key} className="TopCompoundFilter-filter">
              {/* The first compound filter shouldn't display an operator select */}
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
                valueLink={this.link(compoundFilter.value, this._handleCompoundFilterValueChange.bind(null, idx))}
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
