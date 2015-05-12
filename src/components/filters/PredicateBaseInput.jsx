import React, { PropTypes } from 'react/addons';
import _ from 'lodash';
import classNames from 'classnames';

import Select from '../inputs/Select';

import InputMixin, { getDefaultValue } from '../../mixins/InputMixin';

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
      disabled: PropTypes.bool,
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
  _getPredicate(predicateId) {
    return _.find(this.props.predicateOptions, { id: predicateId });
  },

  _handlePredicateTypeChange(newPredicateId) {
    let { predicateId, predicateInputValue } = this.getValue();
    let predicate = this._getPredicate(predicateId);
    let newPredicate = this._getPredicate(newPredicateId);

    this.requestChange({
      $set: {
        predicateId: newPredicateId,
        // Conserve the previous value if the two inputs are compatible, otherwise use the default
        predicateInputValue: newPredicate.input === predicate.input ? predicateInputValue : getDefaultValue(newPredicate.input),
      },
    });
  },

  _handlePredicateValueChange(value) {
    this.requestChange({
      predicateInputValue: { $set: value },
    });
  },

  render() {
    let { predicateOptions, className, disabled } = this.props;
    let { predicateId, predicateInputValue } = this.getValue();
    let predicate = this._getPredicate(predicateId);

    return (
      <div className={classNames('PredicateBaseInput', disabled && 'isDisabled', className)}>
        <Select
          disabled={disabled}
          className="PredicateBaseInput-predicateOptions"
          options={predicateOptions}
          valueLink={this.link(predicateId, this._handlePredicateTypeChange)}
          />
        <predicate.input
          disabled={disabled}
          className="PredicateBaseInput-predicateInput"
          valueLink={this.link(predicateInputValue, this._handlePredicateValueChange)}
          />
      </div>
    );
  },

});

PredicateBaseInput.PropTypes = {
  predicateOptions: predicateOptionsPropType,
};

export default PredicateBaseInput;
