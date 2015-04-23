import React, { PropTypes } from 'react/addons';

import Filter from './Filter';
import CompoundFilter from './CompoundFilter';
import ButtonSelect from '../inputs/ButtonSelect';

import InputMixin from '../../mixins/InputMixin';

import './TopCompoundFilter.scss';

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

const defaultOperator = 'and';

const TopCompoundFilter = React.createClass({

  displayName: 'TopCompoundFilter',

  mixins: [
    InputMixin(PropTypes.shape({
      // Id of the selected operator in `OPERATOR_OPTIONS`
      operator: PropTypes.oneOf(OPERATOR_OPTIONS.map((operator) => operator.id)),
      // List of the values of the `CompoundFilter` children
      compoundFilters: PropTypes.arrayOf(CompoundFilter.PropTypes.value),
    }))
  ],

  propTypes: {
    // List of area options, see the `Filter` component
    areaOptions: Filter.PropTypes.areaOptions,
    // Default area id, see the `Filter` component
    defaultAreaId: PropTypes.string,
  },

  _handleCompoundFilterChange(idx, value) {
    this.update({
      compoundFilters: {
        [idx]: { $set: value }
      }
    });
  },

  _handleAddCompoundFilter() {
    this.update({
      compoundFilters: {
        $push: [{
          operator: defaultOperator,
          filters: []
        }]
      }
    });
  },

  _handleRemoveCompoundFilter(idx) {
    this.update({
      compoundFilters: {
        $splice: [[idx, 1]]
      }
    });
  },

  render() {
    let { areaOptions, defaultAreaId } = this.props;
    let { compoundFilters, operator } = this.getValue();

    return (
      <div className="TopCompoundFilter">
        <div className="TopCompoundFilter-filters">
          {compoundFilters.map((compoundFilter, idx) => (
            <div key={idx} className="TopCompoundFilter-filter">
              {/* The first compound filter shouldn't display the operator select, and isn't removable */}
              {idx > 0 &&
                <div className="TopCompoundFilter-filterControls">
                  <ButtonSelect
                    className="TopCompoundFilter-operatorSelect"
                    options={OPERATOR_OPTIONS}
                    {...this.link(operator, (newOperator) => this.update({ operator: { $set: newOperator } }))}
                    />
                  <button
                    className="TopCompoundFilter-removeCompoundFilter btn btn-default"
                    onClick={this._handleRemoveCompoundFilter.bind(null, idx)}
                    >
                    x
                  </button>
                </div>
              }
              <CompoundFilter
                areaOptions={areaOptions}
                defaultAreaId={defaultAreaId}
                {...this.link(compoundFilter, this._handleCompoundFilterChange.bind(null, idx))}
                />
            </div>
          ))}
        </div>
        <button
          className="TopCompoundFilter-addCompoundFilter btn btn-default"
          onClick={this._handleAddCompoundFilter}
          >
          +
        </button>
      </div>
    );
  }

});

export default TopCompoundFilter;
