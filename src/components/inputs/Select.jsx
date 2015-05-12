import React, { PropTypes } from 'react/addons';
import classNames from 'classnames';

import InputMixin from '../../mixins/InputMixin';

const NULL_OPTION = '__null__';

const optionPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
});

const optionGroupOf = propType => PropTypes.oneOfType([
  PropTypes.shape({
    isGroup: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(propType).isRequired,
  }),
  propType,
]);

const Select = React.createClass({

  displayName: 'Select',

  mixins: [
    InputMixin(PropTypes.string),
  ],

  propTypes: {
    className: PropTypes.string,
    // List of select options `{ id, label }` or `{ isGroup, id, label, options }` in the case of an option group
    options: PropTypes.arrayOf(optionGroupOf(optionPropType)).isRequired,
    // If defined and there is no selected option, a dummy option will be created with this label and selected
    // by default. Once another option is selected, it will disappear.
    nullLabel: PropTypes.string,
  },

  statics: {
    /**
     * Find an option in an array where options can be nested in groups
     * @param  {Array<Option|OptionGroup>}  options
     * @param  {String}                     optionId
     * @return {Option}
     */
    getOption(options, optionId) {
      let found;
      for (let i = 0; i < options.length; i++) {
        let option = options[i];
        // Option groups are identified by an `isGroup` property set to `true`
        if (option.isGroup) {
          found = Select.getOption(option.options, optionId);
          if (found) {
            break;
          }
        } else if (option.id === optionId) {
          found = option;
          break;
        }
      }
      return found;
    },
  },

  _handleChange(newValue) {
    this.requestChange({ $set: newValue });
  },

  _renderOption(option) {
    return (
      <option key={option.id} value={option.id}>
        {option.label}
      </option>
    );
  },

  render() {
    let { options, className, nullLabel, ...otherProps } = this.props;
    let selectedOptionId = this.getValue();

    return (
      <select
        {...otherProps}
        className={classNames('Select', className)}
        valueLink={this.link(selectedOptionId || NULL_OPTION, this._handleChange)}
        >
        {!selectedOptionId && nullLabel &&
          <option value={NULL_OPTION} disabled>{nullLabel}</option>
        }
        {options.map((option, idx) => {
          if (option.isGroup) {
            return (
              <optgroup key={idx} label={option.label}>
                {option.options.map(this._renderOption)}
              </optgroup>
            );
          } else {
            return this._renderOption(option);
          }
        })}
      </select>
    );
  },

});

Select.PropTypes = {
  option: optionPropType,

  optionGroupOf: optionGroupOf,
};

export default Select;
