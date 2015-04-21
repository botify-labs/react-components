import React, { PropTypes } from 'react/addons';
import classNames from 'classnames';

import InputMixin from '../../mixins/InputMixin';
import { optionShape, optionGroupOf } from '../../shapes/option';

const NULL_OPTION = '__null__';

const Select = React.createClass({

  displayName: 'Select',

  mixins: [
    InputMixin(PropTypes.string)
  ],

  propTypes: {
    className: PropTypes.string,
    options: PropTypes.arrayOf(optionGroupOf(optionShape)).isRequired,
    // If defined and there is no selected option, a dummy option will be created with this label and selected
    // by default. Once another option is selected, it will disappear.
    nullLabel: PropTypes.string,
  },

  _handleChange(e) {
    this.update({ $set: e.target.value });
  },

  _renderOption(option) {
    return (
      <option key={option.id} value={option.id}>
        {option.label}
      </option>
    );
  },

  render() {
    let { options, className, nullLabel } = this.props;
    let selectedOptionId = this.getValue();

    return (
      <select
        className={classNames('Select', className)}
        {...this.link(selectedOptionId || NULL_OPTION, this._handleChange)}
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
  }

});

export default Select;
