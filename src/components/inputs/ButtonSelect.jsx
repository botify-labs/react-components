import React, { PropTypes } from 'react';
import classNames from 'classnames';

import InputMixin from '../../mixins/InputMixin';
import { optionShape } from '../../shapes/option';

const ButtonSelect = React.createClass({

  displayName: 'ButtonSelect',

  mixins: [
    InputMixin(PropTypes.string)
  ],

  propTypes: {
    className: PropTypes.string,
    options: PropTypes.arrayOf(optionShape).isRequired,
    // Disables all the buttons in the select
    disabled: PropTypes.bool,
    // Once an option is selected, can it be unselected?
    allowUnselect: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      disabled: false,
      allowUnselect: false,
    };
  },

  _handleChange(selectedOptionId) {
    this.update({ $set: selectedOptionId });
  },

  render() {
    let { options, className, disabled, allowUnselect } = this.props;
    let selectedOptionId = this.getValue();

    return (
      <div className={classNames('ButtonSelect', 'btn-group', className)}>
        {options.map((option) => {
          let isActive = option.id === selectedOptionId;
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
              className={classNames('btn', 'btn-default', isActive && 'active')}
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
  }

});

export default ButtonSelect;
