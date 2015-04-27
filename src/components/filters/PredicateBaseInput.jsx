import React, { PropTypes } from 'react/addons';
import _ from 'lodash';
import classNames from 'classnames';

import Select from '../inputs/Select';

import InputMixin from '../../mixins/InputMixin';

const predicateOptionPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  input: PropTypes.func.isRequired,
});

const predicateOptionsPropType = PropTypes.arrayOf(predicateOptionPropType);

const PredicateBaseInput = React.createClass({

  displayName: 'PredicateBaseInput',

  mixins: [
    InputMixin(PropTypes.shape({
      // Id of the selected predicate in `props.predicateOptions`
      predicateId: PropTypes.string,
      // Value of the selected predicate input, its format depends entirely on the predicate input
      predicateInputValue: PropTypes.any,
    })),
  ],

  propTypes: {
    className: PropTypes.string,
    // List of predicate options `{ id, label, input }`
    predicateOptions: predicateOptionsPropType.isRequired,
  },

  /**
   * Returns the predicate option with the given id
   * @param  {String} predicateId
   */
  _getOperator(predicateId) {
    return _.find(this.props.predicateOptions, { id: predicateId });
  },

  _handleOperatorTypeChange(newPredicateId) {
    let { predicateId, predicateInputValue } = this.getValue();
    let predicate = this._getOperator(predicateId);
    let newPredicate = this._getOperator(newPredicateId);

    this.update({
      $set: {
        predicateId: newPredicateId,
        // Similar to filter inputs, predicate inputs can also define a `getInitialValue(prevInput, prevValue)`.
        predicateInputValue: newPredicate.input.getInitialValue(predicate.input, predicateInputValue),
      },
    });
  },

  _handleOperatorValueChange(value) {
    this.update({
      predicateInputValue: { $set: value },
    });
  },

  render() {
    let { predicateOptions, className } = this.props;
    let { predicateId, predicateInputValue } = this.getValue();
    let predicate = this._getOperator(predicateId);

    return (
      <div className={classNames('PredicateBaseInput', className)}>
        <Select
          className="PredicateBaseInput-predicateOptions"
          options={predicateOptions}
          {...this.link(predicateId, this._handleOperatorTypeChange)}
          />
        <predicate.input
          className="PredicateBaseInput-predicateInput"
          {...this.link(predicateInputValue, this._handleOperatorValueChange)}
          />
      </div>
    );
  },

});

PredicateBaseInput.PropTypes = {
  predicateOptions: predicateOptionsPropType,
};

export default PredicateBaseInput;
