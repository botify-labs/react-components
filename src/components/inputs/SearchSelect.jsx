import React, { PropTypes } from 'react/addons';
import _ from 'lodash';
import classNames from 'classnames';

import InputMixin from '../../mixins/InputMixin';

import './SearchSelect.scss';


//const ENTER_KEY = 15;
const DEFAULT_PLACEHOLDER = 'Search option';

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

const OptionDefault = React.createClass({

  displayName: 'Option',

  propTypes: {
    option: PropTypes.shape({
      ...optionPropType,
      label: PropTypes.string.isRequired,
    }).isRequired,
  },

  render() {
    let {
      option: {label},
      ...otherProps,
    } = this.props;

    return (
      <div className="Option" {...otherProps}>
        <span>{label}</span>
      </div>
    );
  },

});

const Select = React.createClass({

  displayName: 'Select',

  mixins: [
    InputMixin(optionPropType),
  ],

  propTypes: {
    className: PropTypes.string,
    placeHolder: PropTypes.string,
    options: PropTypes.arrayOf(optionGroupOf(optionPropType)).isRequired,
    optionRender: PropTypes.func,
    filterOption: PropTypes.func, //By default filter option by their label.
    hideGroupsWithNoMatch: PropTypes.bool,
    valueLink: PropTypes.shape({
      value: optionPropType,
      requestChange: PropTypes.func.isRequired,
    }).isRequired,
  },

  //Life Cycle methods

  getDefaultProps() {
    return {
      placeHolder: DEFAULT_PLACEHOLDER,
      optionRender: OptionDefault,
      filterOption: (filter, option, group) => (new RegExp(filter, 'i').test(option.label)),
      hideGroupsWithNoMatch: true,
    };
  },

  getInitialState() {
    return {
      isFocused: false,
    };
  },

  //Helpers

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

  _removeSelection() {
    this.requestChange({ $set: null });
  },

  _selectOption(option) {
    this.requestChange({ $set: option });
    this.setState({isFocused: false});
  },

  _getFilteredOptions() {
    let {options, filterOption, hideGroupsWithNoMatch} = this.props;
    let {inputValue} = this.state;

    //Filter grouped options
    options = _.map(options, (group) => {
      if (!group.isGroup) {
        return group;
      }
      return {
        ...group,
        options: _.filter(group.options, (option) => !inputValue || filterOption(inputValue, option, group)),
      };
    });

    //Remove empty groups if hideGroupsWithNoMatch == true
    options = _.filter(options, (option) => !(option.isGroup && option.options.length === 0 && hideGroupsWithNoMatch));

    //Filter non grouped options
    options = _.filter(options, (option) => option.isGroup || (!inputValue || filterOption(inputValue, option)));

    return options;
  },

  //Elements Listeners

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

  _onInputChange(e) {
    this._removeSelection();
    let newValue = e.target.value;
    this.setState({inputValue: newValue});
  },

  _onInputBlur(e) {
    this._blurInterval = setTimeout(() => {
      if (!this.props.valueLink.value) {
        this.setState({inputValue: ''});
      }
    }, 50);
  },

  render() {
    let {
      className,
      placeHolder,
      optionRender: OptionRender,
      valueLink: {value},
    } = this.props;
    let options = this._getFilteredOptions();
    let { isFocused, inputValue } = this.state;

    return (
      <div
        className={classNames('Select', `Select--${isFocused ? 'opened' : 'closed'}`, className)}
        onMouseLeave={this._onBlur}
      >
        <div className="Select-value">
          <input
            className="Select-searchInput"
            type="text"
            ref="searchInput"
            placeholder={placeHolder}
            value={inputValue}
            onFocus={this._onFocus}
            onBlur={this._onInputBlur}
            onChange={this._onInputChange}
          />
          <span className="Select-valueSpan">{value ? value.label : ''}</span>
        </div>
        <div
          className="Select-optionsList"
          onMouseEnter={this._onFocus}
        >
          {_.map(options, (option, i) => {
            if (option.isGroup) {
              return (
                <OptionGroup
                  key={i}
                  optionGroup={option}
                  optionRender={OptionRender}
                  filter={inputValue}
                  onOptionClick={this._selectOption}
                />
              );
            } else {
              return (
                <OptionRender
                  key={i}
                  option={option}
                  filter={inputValue}
                  onClick={this._selectOption.bind(null, option)}
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
    filter: PropTypes.string.isRequired,
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
      filter,
      onOptionClick,
      ...otherProps,
    } = this.props;
    let {isOpened} = this.state;

    return (
      <div
        className={classNames("OptionGroup", `OptionGroup--${isOpened ? 'opened' : 'closed'}`)}
        {...otherProps}
      >
        <div
          className="OptionGroup-header"
          onClick={this._toggleOpen}
        >
          <i className="OptionGroup-headerIcon" />
          <span className="OptionGroup-headerLabel">{label}</span>
        </div>
        <div className="OptionGroup-options">
          {_.map(options, (option, i) => (
            <OptionRender
              key={i}
              option={option}
              filter={filter}
              onClick={onOptionClick.bind(null, option)}
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
