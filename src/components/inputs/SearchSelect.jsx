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
    this._clearFilterValue();
    this._closeList();
    this._blurFilterInput();
  },

  //State Helpers: openGroupsId

  _isGroupOpen(openGroupsId, group) {
    return _.contains(openGroupsId, group.id);
  },

  _toggleGroupOpenState(group) {
    let { openGroupsId } = this.state,
        isOpened = this._isGroupOpen(openGroupsId, group);

    if (isOpened) {
      this._closeGroup(group);
    } else {
      this._openGroup(group);
    }
  },

  _openGroup(group) {
    let { openGroupsId } = this.state;
    this.setState({openGroupsId: update(openGroupsId, {$push: [group.id]})});
  },

  _closeGroup(group) {
    let { openGroupsId } = this.state;
    this.setState({openGroupsId: _.remove(openGroupsId, group.id)});
  },

  _openSuggestedGroup(suggestionOption) {
    let { options } = this.props,
        { openGroupsId } = this.state;

    let suggestedGroup = _.find(options, (group) => group.isGroup && _.contains(_.pluck(group.options, 'id'), suggestionOption.id));
    if (suggestedGroup && !this._isGroupOpen(openGroupsId, suggestedGroup)) {
      this._openGroup(suggestedGroup);
    }
  },

  _openAllGroups() {
    let {options} = this.props;
    let allGroupsIds = _.pluck(_.filter(options, 'isGroup'), 'id');
    this.setState({
      openGroupsId: allGroupsIds,
    });
  },

  _closeAllGroups() {
    this.setState({
      openGroupsId: [],
    });
  },

  //State Helpers: filterValue

  _updateFilterValue(newFilterValue) {
    this.setState({filterValue: newFilterValue});
    this._suggestFirstOption(newFilterValue);
  },

  _clearFilterValue() {
    this._updateFilterValue('');
  },

  //State Helpers: suggestedOption

  _suggestFirstOption(filterValue) {
    let suggestion = this._getOptionsIterator(filterValue)[0];
    this._setSuggestedOption(suggestion);
  },

  _suggestPreviousOption(filterValue, suggestedOption) {
    let optionsIterator = this._getOptionsIterator(filterValue);

    let currentSuggestionIndex = suggestedOption ? _.findIndex(optionsIterator, (option) => option.id === suggestedOption.id) : -1;
    let previousSuggestionIndex = currentSuggestionIndex > 0 ? currentSuggestionIndex - 1 : currentSuggestionIndex;

    this._setSuggestedOption(optionsIterator[previousSuggestionIndex]);
  },

  _suggestNextOption(filterValue, suggestedOption) {
    let optionsIterator = this._getOptionsIterator(filterValue);

    let currentSuggestionIndex = suggestedOption ? _.findIndex(optionsIterator, (option) => option.id === suggestedOption.id) : -1;
    let nextSuggestionIndex = currentSuggestionIndex < (optionsIterator.length - 1) ? currentSuggestionIndex + 1 : currentSuggestionIndex;

    this._setSuggestedOption(optionsIterator[nextSuggestionIndex]);
  },

  _setSuggestedOption(option) {
    this.setState({suggestedOption: option});
    this._openSuggestedGroup(option);
  },

  _clearSuggestionOption() {
    this._setSuggestedOption(null);
  },

  //State Helpers: filteredOptions

  _getOptionsIterator(filterValue) {
    let options = this._getFilteredOptions(filterValue);
    return _.flatten(_.map(options, (option) => option.isGroup ? option.options : option));
  },

  _getFilteredOptions(filterValue) {
    let {options, filterOption, hideGroupsWithNoMatch} = this.props;

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
    this._blurFilterInput();
    this.setState({isFocused: false});
    this._closeAllGroups();
  },

  _focusFilterInput() {
    this.refs.searchInput.getDOMNode().focus();
  },

  _blurFilterInput() {
    this.refs.searchInput.getDOMNode().blur();
  },

  //Elements Listeners

  _cancelBlurInterval() {
    if (this._blurInterval) {
      clearTimeout(this._blurInterval);
      this._blurInterval = null;
    }
  },

  _onFocus(e) {
    this._cancelBlurInterval();
    this._openList();
  },

  _onBlur(e) {
    this._cancelBlurInterval();
    this._blurInterval = setTimeout(() => {
      this._closeList();
    }, 400);
  },

  _onSelectValueClick(e) {
    this._focusFilterInput();
  },

  _onFilterInputChange(e) {
    let newValue = e.target.value;
    let previousValue = this.state.filterValue;

    this._removeSelection();
    this._updateFilterValue(newValue);

    if (newValue === '') {
      this._closeAllGroups();
    }

    let wasEmpty = previousValue.length === 0 && newValue.length > 0;
    if (wasEmpty) {
      this._openAllGroups();
    }
  },

  _onFilterInputBlur(e) {
    this._cancelBlurInterval();
    this._blurInterval = setTimeout(() => {

      this._clearFilterValue();

      this._closeList();
    }, 100);
  },

  _onFilterInputKeyDown(e) {
    switch (e.which) {
    case KEY_CODES.TAB:
    case KEY_CODES.ENTER:
      this._selectOption(this.state.suggestedOption);
      break;
    case KEY_CODES.ARROW_UP:
      this._suggestPreviousOption(this.state.filterValue, this.state.suggestedOption);
      break;
    case KEY_CODES.ARROW_DOWN:
      this._suggestNextOption(this.state.filterValue, this.state.suggestedOption);
      break;
    }
  },

  _onGroupClick(group, e) {
    this._cancelBlurInterval();
    this._toggleGroupOpenState(group);
  },

  _onOptionSelect(option, e) {
    this._selectOption(option);
  },

  //Renders

  render() {
    let {
      className,
      placeHolder,
      valueLink: {value},
    } = this.props;
    let { isFocused, filterValue } = this.state;
    let filteredOptions = this._getFilteredOptions(filterValue);




    return (
      <div
        className={classNames('Select', `Select--${isFocused ? 'opened' : 'closed'}`, className)}
        onMouseLeave={this._onBlur}
      >
        <div className="Select-value"
          onClick={this._onSelectValueClick}
        >
          <input
            className={classNames('Select-filterInput', filterValue === '' && 'Select-filterInput-isEmpty')}
            type="text"
            ref="searchInput"
            placeholder={placeHolder}
            value={filterValue}
            onFocus={this._onFocus}
            onBlur={this._onFilterInputBlur}
            onChange={this._onFilterInputChange}
            onKeyDown={this._onFilterInputKeyDown}
          />
          <span className="Select-valueSpan">{value ? value.label : ''}</span>
        </div>
        <div
          className="Select-optionsList"
          onMouseEnter={this._onFocus}
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
    let isOpened = this._isGroupOpen(this.state.openGroupsId, group);
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
