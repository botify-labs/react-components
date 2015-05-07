import React, { PropTypes } from 'react/addons';
import _ from 'lodash';
import classNames from 'classnames';

import StringInput from './StringInput';
import InputMixin from '../../mixins/InputMixin';

import './SearchSelect.scss';


//const ENTER_KEY = 15;
//const NULL_OPTION = '__null__';
const DEFAULT_NULL_LABEL = 'Search option';

const optionPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
});

const optionGroupOf = (_optionPropType) => PropTypes.oneOfType([
  PropTypes.shape({
    isGroup: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(_optionPropType).isRequired,
  }),
  optionPropType,
]);

const Select = React.createClass({

  displayName: 'Select',

  mixins: [
    InputMixin(optionPropType),
  ],

  propTypes: {
    className: PropTypes.string,
    // List of select options `{ id, label }` or `{ isGroup, id, label, options }` in the case of an option group
    options: PropTypes.arrayOf(optionGroupOf(optionPropType)).isRequired,
    // If defined and there is no selected option, a dummy option will be created with this label and selected
    // by default. Once another option is selected, it will disappear.
    placeHolder: PropTypes.string,
    optionRender: PropTypes.func,
  },

  getDefaultProps() {
    return {
      placeHolder: DEFAULT_NULL_LABEL,
      valueLink: {
        value: {},
      },
    };
  },

  getInitialState() {
    return {
      isFocused: false,
    };
  },

  _onFocus() {
    this._cancelBlurInterval();
    this.setState({isFocused: true});
  },

  _onBlur() {
    this._cancelBlurInterval();
    this._blurInterval = setTimeout(() => {
      this._blurInput();
      this.setState({isFocused: false});
    }, 500);
  },

  _cancelBlurInterval() {
    if (this._blurInterval) {
      clearTimeout(this._blurInterval);
      this._blurInterval = null;
    }
  },

  _blurInput() {
    let node = this.refs.searchInput.getDOMNode();
    node.blur();
  },

  _selectOption(option) {
    this.requestChange({ $set: option });
  },

  _onChangeInput(e) {

  },

  render() {
    let { options, optionRender: OptionRender, className, placeHolder } = this.props;
    let selectedOption = this.getValue();
    let { isFocused } = this.state;

    return (
      <div
        className={classNames('Select', `Select--${isFocused ? 'opened' : 'closed'}`, className)}
        onMouseLeave={this._onBlur}
      >
        <StringInput
          className="Select-searchInput"
          placeholder={placeHolder}
          onFocus={this._onFocus}
          ref="searchInput"
          value={selectedOption ? selectedOption.label : ''}
          onChange={this._onChangeInput}
        />
        <div
          className="Select-optionsList"
          onMouseEnter={this._onFocus}
        >
          {_.map(options, (option, i) => {
            if (option.isGroup) {
              return (
                <OptionGroup
                  optionGroup={option}
                  optionRender={OptionRender}
                  onOptionClick={this._selectOption}
                  key={i}
                />
              );
            }
          })}
        </div>
      </div>
    );
  },

});


let OptionGroup = React.createClass({

  displayName: 'OptionGroup',

  propTypes: {
    optionGroup: optionGroupOf(optionPropType).isRequired,
    optionRender: PropTypes.func.isRequired,
    onOptionClick: PropTypes.func,
  },

  getInitialState() {
    return {
      isOpened: false,
    };
  },

  _toggleOpen() {
    this.setState((previousState) => {
      return {
        isOpened: !previousState.isOpened,
      };
    });
  },

  render() {
    let {
      optionGroup: {label, options},
      optionRender: OptionRender,
      onOptionClick,
      ...otherProps,
    } = this.props;
    let {isOpened} = this.state;

    return (
      <div
        className={classNames("OptionGroup", `OptionGroup--${isOpened ? 'opened' : 'closed'}`)}
        {...otherProps}
      >
        <div className="OptionGroup-header" onClick={this._toggleOpen}>
          <i className="OptionGroup-headerIcon" />
          <span className="OptionGroup-headerLabel">{label}</span>
        </div>
        <div className="OptionGroup-options">
          {_.map(options, (option, i) => (
            <OptionRender
              onClick={onOptionClick.bind(null, option)}
              option={option}
              key={i}
            />
          ))}
        </div>
      </div>
    );
  },

});



Select.PropTypes = {
  option: optionPropType,
  optionGroupOf: optionGroupOf,
};

export default Select;
