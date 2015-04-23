import React, { PropTypes } from 'react/addons';
import _ from 'lodash';
import classNames from 'classnames';

import Select from '../inputs/Select';

import InputMixin from '../../mixins/InputMixin';

const operatorOptionPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.func.isRequired,
});

const operatorOptionsPropType = PropTypes.arrayOf(operatorOptionPropType);

const PredicateFilterBaseType = React.createClass({

  displayName: 'PredicateFilterBaseType',

  mixins: [
    InputMixin(PropTypes.shape({
      // Id of the selected operator in `props.operatorOptions`
      operatorId: PropTypes.string,
      // Value of the selected operator, its format depends entirely on the operator type
      operatorValue: PropTypes.any
    }))
  ],

  propTypes: {
    className: PropTypes.string,
    // List of operator options `{ id, label, type }`
    operatorOptions: operatorOptionsPropType.isRequired,
  },

  /**
   * Returns the operator option with the given id
   * @param  {String} operatorId
   */
  _getOperator(operatorId) {
    return _.find(this.props.operatorOptions, { id: operatorId });
  },

  _handleOperatorTypeChange(newOperatorId) {
    let { operatorId, operatorValue } = this.getValue();
    let operator = this._getOperator(operatorId);
    let newOperator = this._getOperator(newOperatorId);

    this.update({
      $set: {
        operatorId: newOperatorId,
        // Similar to filter types, operator types can also define a `getInitialValue(prevType, prevValue)`.
        operatorValue: newOperator.type.getInitialValue(operator.type, operatorValue),
      }
    });
  },

  _handleOperatorValueChange(value) {
    this.update({
      operatorValue: { $set: value },
    });
  },

  render() {
    let { operatorOptions, className } = this.props;
    let { operatorId, operatorValue } = this.getValue();
    let operator = this._getOperator(operatorId);

    return (
      <div className={classNames('PredicateFilterBaseType', className)}>
        <Select
          className="PredicateFilterBaseType-operatorOptions"
          options={operatorOptions}
          {...this.link(operatorId, this._handleOperatorTypeChange)}
          />
        <operator.type
          className="PredicateFilterBaseType-operatorType"
          {...this.link(operatorValue, this._handleOperatorValueChange)}
          />
      </div>
    );
  }

});

PredicateFilterBaseType.PropTypes = {
  operatorOptions: operatorOptionsPropType
};

export default PredicateFilterBaseType;
