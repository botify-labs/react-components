import React, { PropTypes } from 'react';
import classNames from 'classnames';

import InputMixin from '../../mixins/InputMixin';
import Select from './Select';

const ButtonSelect = React.createClass({

  displayName: 'ButtonSelect',

  propTypes: {
    className: PropTypes.string,
    // List of select options `{ id, label }`
    options: PropTypes.arrayOf(Select.PropTypes.option).isRequired,
    // Disables all the buttons in the select
    disabled: PropTypes.bool,
    // Once an option is selected, can it be unselected?
    allowUnselect: PropTypes.bool,
  },

  mixins: [
    InputMixin(PropTypes.string),
  ],

  getDefaultProps() {
    return {
      disabled: false,
      allowUnselect: false,
    };
  },

  _handleChange(selectedOptionId) {
    this.requestChange({ $set: selectedOptionId });
  },

  render() {
    const { options, className, disabled, allowUnselect } = this.props;
    const selectedOptionId = this.getValue();

    return (
      <div className={classNames('ButtonSelect', className)}>
        {options.map((option) => {
          const isActive = option.id === selectedOptionId;
          let onClick;
          if (isActive) {
            if (allowUnselect) {
              onClick = this._handleChange.bind(null, null);
            }
          } else {
            onClick = this._handleChange.bind(null, option.id);
          }
          return (
            <button
              className={classNames('ButtonSelect-option', isActive && 'ButtonSelect-option--active', option.className)}
              key={option.id}
              onClick={onClick}
              disabled={disabled}
              >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  },

});

export default ButtonSelect;
