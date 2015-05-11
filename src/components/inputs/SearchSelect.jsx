import React, { PropTypes, addons } from 'react/addons';
const { update } = addons;
import _ from 'lodash';
import classNames from 'classnames';

import InputMixin from '../../mixins/InputMixin';


const KEY_CODES = {
  TAB: 9,
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
};
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
      hideGroupsWithNoMatch: true,
      filterOption: (filter, option, group) => (new RegExp(filter, 'i').test(option.label)),
    };
  },

  getInitialState() {
    return {
      filterValue: '',
      suggestedOption: null,
      isFocused: false,
      openGroupsId: [],
    };
  },

  //Prop Helpers: value

  _removeSelection() {
    this.requestChange({ $set: null });
  },

  _selectOption(option) {
    this.requestChange({ $set: option });
    this._setSuggestedOption(option);
  },

  //State Helpers: openGroupsId

  _isGroupOpen(group) {
    let {openGroupsId} = this.state;
    return _.contains(openGroupsId, group.id);
  },

  _toggleGroupOpenState(group) {
    let isOpened = this._isGroupOpen(group);

    if (isOpened) {
      this._closeGroup(group);
    } else {
      this._openGroup(group);
    }
  },

  _openGroup(group) {
    let { openGroupsId } = this.state;
    this.setState({ openGroupsId: update(openGroupsId, {$push: [group.id]}) });
  },

  _closeGroup(group) {
    let { openGroupsId } = this.state;
    let index = _.findIndex(openGroupsId, (id) => id === group.id);
    this.setState({ openGroupsId: update(openGroupsId, {$splice: [[index, 1]]}) });
  },

  _openParentGroupIfNot(option) {
    let { options } = this.props;

    let suggestedGroup = _.find(options, (group) => group.isGroup && _.contains(_.pluck(group.options, 'id'), option.id));
    if (suggestedGroup && !this._isGroupOpen(suggestedGroup)) {
      this._openGroup(suggestedGroup);
    }
  },

  _openAllGroups() {
    let {options} = this.props;
    let allGroupsIds = _.pluck(_.filter(options, 'isGroup'), 'id');
    this.setState({ openGroupsId: allGroupsIds });
  },

  _closeAllGroups() {
    this.setState({ openGroupsId: [] });
  },

  //State Helpers: filterValue

  _updateFilterValue(newFilterValue) {
    this.setState({filterValue: newFilterValue});
  },

  _clearFilterValue() {
    this._updateFilterValue('');
  },

  //State Helpers: suggestedOption

  _suggestFirstOption() {
    let suggestion = this._getOptionsIterator()[0];
    this._setSuggestedOption(suggestion);
  },

  _suggestPreviousOption() {
    this._moveSuggestion(-1);
  },

  _suggestNextOption() {
    this._moveSuggestion(1);
  },

  /**
   * @param  {Integer} n
   */
  _moveSuggestion(n) {
    let {suggestedOption} = this.state;
    let optionsIterator = this._getOptionsIterator();

    let currentSuggestionIndex = suggestedOption ? _.findIndex(optionsIterator, (option) => option.id === suggestedOption.id) : 0;
    let movedSuggestionIndex = currentSuggestionIndex + n;

    movedSuggestionIndex = Math.min(Math.max(movedSuggestionIndex, 0), optionsIterator.length - 1);

    this._setSuggestedOption(optionsIterator[movedSuggestionIndex]);
  },

  _setSuggestedOption(option) {
    this.setState({suggestedOption: option});
  },

  _clearSuggestionOption() {
    this._setSuggestedOption(null);
  },

  //State Helpers: filteredOptions

  _getOptionsIterator() {
    let options = this._getFilteredOptions();
    return _.flatten(_.map(options, (option) => option.isGroup ? option.options : option));
  },

  _getFilteredOptions() {
    let {options, filterOption, hideGroupsWithNoMatch} = this.props;
    let {filterValue} = this.state;

    //Filter grouped options
    options = _.map(options, (group) => {
      if (!group.isGroup) {
        return group;
      }
      return {
        ...group,
        options: _.filter(group.options, (option) => !filterValue || filterOption(filterValue, option, group)),
      };
    });

    //Remove empty groups if hideGroupsWithNoMatch == true
    options = _.filter(options, (option) => !(option.isGroup && option.options.length === 0 && hideGroupsWithNoMatch));

    //Filter non grouped options
    options = _.filter(options, (option) => option.isGroup || (!filterValue || filterOption(filterValue, option)));

    return options;
  },

  //Element Helpers

  _openList() {
    this.setState({isFocused: true});
  },

  _closeList() {
    this.setState({isFocused: false});
  },

  _focusFilterInput() {
    React.findDOMNode(this.refs.searchInput).focus();
  },

  //Elements Listeners

  _cancelBlurInterval() {
    if (this._blurInterval) {
      clearTimeout(this._blurInterval);
      this._blurInterval = null;
    }
  },

  _onInputClick(e) {
    this._cancelBlurInterval();
    this._focusFilterInput();
  },

  _onFilterInputFocus(e) {
    this._cancelBlurInterval();
    this._openList();
  },

  _onFilterInputBlur(e) {
    this._cancelBlurInterval();
    this._blurInterval = setTimeout(() => {
      this._clearFilterValue();
      this._closeAllGroups();
      this._closeList();
    }, 100);
  },

  _onFilterInputChange(e) {
    this._cancelBlurInterval();
    this._updateFilterValue(e.target.value);
  },

  _onFilterInputKeyDown(e) {
    this._cancelBlurInterval();
    switch (e.which) {
    case KEY_CODES.ENTER:
      if (!this.state.isFocused) {
        this._openList();
        break;
      }
    case KEY_CODES.TAB:
      this._selectOption(this.state.suggestedOption);
      break;
    case KEY_CODES.ARROW_UP:
      this._suggestPreviousOption();
      break;
    case KEY_CODES.ARROW_DOWN:
      this._suggestNextOption();
      break;
    }
  },

  _onGroupClick(group, e) {
    this._cancelBlurInterval();
    this._toggleGroupOpenState(group);
    this._focusFilterInput();
  },

  _onOptionSelect(option, e) {
    this._cancelBlurInterval();
    this._selectOption(option);
  },

  componentDidUpdate(prevProps, prevState) {
    let {valueLink: {value}} = this.props,
        {suggestedOption, filterValue} = this.state;

    console.log('componentDidUpdate');

    //Clear select if new value
    if (prevProps.valueLink.value !== value) {
      console.log('1');
      this._clearFilterValue();
      this._closeAllGroups();
      this._closeList();
    }

    if (prevState.filterValue !== filterValue) {
      console.log('2');
      this._removeSelection();

      //Select first option if not setted whereas filterValue is not empty
      if (filterValue && !suggestedOption) {
        console.log('2.1');
        this._suggestFirstOption(filterValue);
      }

      //Open all groups if filterValue was empty
      let filterValueWasEmpty = prevState.filterValue.length === 0 && filterValue.length > 0;
      if (filterValueWasEmpty) {
        console.log('2.2');
        this._openAllGroups();
      }

      //Close all groups if filterValue become empty
      let filterValueBecomeEmpty = prevState.filterValue.length > 0 && filterValue.length === 0;
      if (filterValueBecomeEmpty) {
        console.log('2.2');
        this._closeAllGroups();
      }
    }

    //Open Suggested Group
    if (suggestedOption) {
      console.log('3');
      this._openParentGroupIfNot(suggestedOption);
    }
  },

  //Renders

  render() {
    let {
      className,
      placeHolder,
      valueLink: {value},
    } = this.props;
    let { isFocused, filterValue } = this.state;
    let filteredOptions = this._getFilteredOptions();

    return (
      <div
        className={classNames('Select', `Select--${isFocused ? 'opened' : 'closed'}`, className)}
      >
        <div className="Select-input"
          onClick={this._onInputClick}
        >
          <input
            className={classNames('Select-filterInput', !filterValue && 'Select-filterInput--empty')}
            type="text"
            ref="searchInput"
            value={filterValue}
            onFocus={this._onFilterInputFocus}
            onBlur={this._onFilterInputBlur}
            onChange={this._onFilterInputChange}
            onKeyDown={this._onFilterInputKeyDown}
          />
          <span className="Select-valueSpan">{value ? value.label : ''}</span>
          {!filterValue && !value &&
            <span className="Select-placeholder">{placeHolder}</span>
          }
        </div>
        <div
          className="Select-optionsList"
        >
          {_.map(filteredOptions, (option, i) => {
            let render = option.isGroup ? this._renderGroup : this._renderOption;
            return render(option, i);
          })}
        </div>
      </div>
    );
  },

  _renderGroup(group, key) {
    let isOpened = this._isGroupOpen(group);
    return (
      <div
        className={classNames("Select-group", `Select-group--${isOpened ? 'opened' : 'closed'}`)}
        key={key}
      >
        <div
          className="Select-groupHeader"
          onClick={this._onGroupClick.bind(null, group)}
        >
          <i className="Select-groupHeaderIcon" />
          <span className="Select-groupheaderLabel">{group.label}</span>
        </div>
        <div className="Select-groupOptions">
          {_.map(group.options, this._renderOption)}
        </div>
      </div>
    );
  },

  _renderOption(option, key) {
    let {
      optionRender: OptionRender,
    } = this.props;
    let { filterValue, suggestedOption } = this.state;

    let isSuggested = suggestedOption && suggestedOption.id === option.id;

    return (
      <OptionRender
        className={classNames('Select-option', isSuggested && 'Select-option--suggested')}
        key={key}
        option={option}
        filter={filterValue}
        onClick={this._onOptionSelect.bind(null, option)}
      />
    );
  },

});


Select.PropTypes = {
  option: optionPropType,
  optionGroupOf: optionGroupOf,
};

export default Select;
