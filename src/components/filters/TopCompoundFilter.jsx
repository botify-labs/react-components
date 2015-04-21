import React, { PropTypes } from 'react/addons';

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
      operator: PropTypes.string,
      compoundFilters: PropTypes.arrayOf(PropTypes.any),
    }))
  ],

  propTypes: {
    areaOptions: PropTypes.any,
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
                    className="btn btn-danger"
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
          className="btn btn-default"
          onClick={this._handleAddCompoundFilter}
          >
          +
        </button>
      </div>
    );
  }

});

export default TopCompoundFilter;
