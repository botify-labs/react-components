import React, { PropTypes, addons } from 'react/addons';
const { update } = addons;
import _ from 'lodash';
import classNames from 'classnames';

import Select from './Select';
import InputMixin from '../../mixins/InputMixin';


const KEY_CODES = {
  TAB: 9,
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
};
const DEFAULT_PLACEHOLDER = 'Search option';


const OptionDefault = React.createClass({

  displayName: 'Option',

  propTypes: {
    option: PropTypes.shape({
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

const SearchSelect = React.createClass({

  displayName: 'SearchSelect',

  mixins: [
    InputMixin(React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ])),
  ],

  propTypes: {
    className: PropTypes.string,
    placeHolder: PropTypes.string,
    options: PropTypes.arrayOf(Select.PropTypes.optionGroupOf(Select.PropTypes.option)).isRequired,
    optionRender: PropTypes.func,
    filterOption: PropTypes.func, //By default filter option by their label.
    hideGroupsWithNoMatch: PropTypes.bool,
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
      suggestedOptionId: this.getValue(),
      isFocused: false,
      isListOpen: false,
      openGroupsId: [],
    };
  },

  //Prop Helpers: isFocused

  _focus() {
    this.setState({isFocused: true});
  },

  _blur() {
    this.setState({isFocused: false});
  },

  //Prop Helpers: isListOpen

  _openList() {
    this.setState({isListOpen: true});
  },

  _closeList() {
    this.setState({isListOpen: false});
  },

  //Prop Helpers: value

  _selectOption(optionId) {
    this.requestChange({ $set: optionId });
  },

  _getSelectedOptionId(props) {
    return this.getValue(props);
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

  _openParentGroupIfNot(optionId) {
    let { options } = this.props;

    let suggestedGroup = _.find(options, (group) => group.isGroup && _.contains(_.pluck(group.options, 'id'), optionId));
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

  //State Helpers: suggestedOptionId

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
    let {suggestedOptionId} = this.state;
    let optionsIterator = this._getOptionsIterator();

    let currentSuggestionIndex = suggestedOptionId ? _.findIndex(optionsIterator, (option) => option.id === suggestedOptionId) : -1;
    let movedSuggestionIndex = currentSuggestionIndex + n;

    movedSuggestionIndex = Math.min(Math.max(movedSuggestionIndex, 0), optionsIterator.length - 1);

    this._setSuggestedOption(optionsIterator[movedSuggestionIndex]);
  },

  _setSuggestedOption(option) {
    this._setSuggestedOptionId(option ? option.id : null);
  },

  _setSuggestedOptionId(optionId) {
    this.setState({suggestedOptionId: optionId});
  },

  _clearSuggestedOption() {
    this._setSuggestedOptionId(null);
  },

  //Prop Helpers: options

  _getOption(optionId) {
    return _.find(this._getOptionsIterator(false), {id: optionId});
  },

  _getOptionsIterator(filtered = true) {
    let options = filtered ? this._getFilteredOptions() : this.props.options;
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
    if (hideGroupsWithNoMatch) {
      options = _.reject(options, (option) => option.isGroup && option.options.length === 0);
    }

    //Filter non grouped options
    options = _.filter(options, (option) => option.isGroup || (!filterValue || filterOption(filterValue, option)));

    return options;
  },

  //Elements Listeners

  _cancelBlurInterval() {
    if (this._blurInterval) {
      clearTimeout(this._blurInterval);
      this._blurInterval = null;
    }
  },

  _onInputContainerClick(e) {
    this._focus();
    //Open the list as list might be already open.
    this._openList();
  },

  _onFilterInputBlur(e) {
    this._blurInterval = setTimeout(() => {
      this._blur();
    }, 100);
  },

  _onFilterInputChange(e) {
    this._updateFilterValue(e.target.value);
  },

  _onFilterInputKeyDown(e) {
    let {isListOpen} = this.state;

    if (!isListOpen) {
      this._openList();
      return;
    }

    switch (e.which) {
    case KEY_CODES.ENTER:
    case KEY_CODES.TAB:
      this._selectOption(this.state.suggestedOptionId);
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
    this._toggleGroupOpenState(group);
  },

  _onOptionSelect(option, e) {
    this._selectOption(option.id);
  },

  componentDidUpdate(prevProps, prevState) {
    let {isFocused, suggestedOptionId, filterValue} = this.state;
    let selectedOptionId = this._getSelectedOptionId(),
        previousSelectedOptionId = this._getSelectedOptionId(prevProps);

    this._cancelBlurInterval();

    if (prevState.isFocused !== isFocused) {
      if (isFocused) {
        //If became focused, open the list
        this._openList();
      } else {
        //If became blurred, clear the select
        this._clearFilterValue();
        this._closeAllGroups();
        this._closeList();
      }
    }

    //If new value, Clear select without bluring
    if (previousSelectedOptionId !== selectedOptionId) {

      if (selectedOptionId) {
        this._clearFilterValue();
        this._closeAllGroups();
        this._closeList();
        this._setSuggestedOptionId(selectedOptionId);
      }
    }

    if (prevState.filterValue !== filterValue) {

      if (!filterValue && !selectedOptionId) {
        this._clearSuggestedOption();
      }

      //Select first option if not setted whereas filterValue is not empty
      // and remove selection (clear value) when the filtreValue change
      if (filterValue) {
        this._suggestFirstOption(filterValue);
      }

      //Open all groups if filterValue was empty
      let filterValueWasEmpty = prevState.filterValue.length === 0 && filterValue.length > 0;
      if (filterValueWasEmpty) {
        this._openAllGroups();
      }

      //Close all groups if filterValue become empty
      let filterValueBecomeEmpty = prevState.filterValue.length > 0 && filterValue.length === 0;
      if (filterValueBecomeEmpty) {
        this._closeAllGroups();
      }
    }

    //Open Suggested Group
    if (suggestedOptionId) {
      this._openParentGroupIfNot(suggestedOptionId);
    }

    //Focus input is state isFocused
    //Note: I cannot be done in the setstate callback as when the user clicks somewhere on the list,
    //      the input is blurred, so we need to refocus it.
    if (isFocused) {
      React.findDOMNode(this.refs.searchInput).focus();
    }
  },

  componentWillUnmount() {
    this._cancelBlurInterval();
  },

  //Renders

  render() {
    let {
      className,
      placeHolder,
    } = this.props;
    let { isFocused, isListOpen, filterValue } = this.state;
    let selectedOptionId = this._getSelectedOptionId();

    let filteredOptions = this._getFilteredOptions();
    let selectedOption = this._getOption(selectedOptionId);

    return (
      <div
        className={classNames('SearchSelect', isFocused && 'SearchSelect--focused', className)}
      >
        <div className="SearchSelect-inputContainer"
          onClick={this._onInputContainerClick}
        >
          <input
            className={classNames('SearchSelect-filterInput', !filterValue && 'SearchSelect-filterInput--empty')}
            type="text"
            ref="searchInput"
            value={filterValue}
            onBlur={this._onFilterInputBlur}
            onChange={this._onFilterInputChange}
            onKeyDown={this._onFilterInputKeyDown}
          />
          <span className="SearchSelect-valueSpan">{selectedOption ? selectedOption.label : ''}</span>
          {!filterValue && !selectedOptionId &&
            <span className="SearchSelect-placeholder">{placeHolder}</span>
          }
        </div>
        <div
          className={classNames('SearchSelect-optionsList', `SearchSelect-optionsList--${isListOpen ? 'open' : 'closed'}`)}
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
    return (
      <SearchSelectGroup
        key={key}
        label={group.label}
        isOpen={this._isGroupOpen(group)}
        onClick={this._onGroupClick.bind(null, group)}
      >
        {_.map(group.options, this._renderOption)}
      </SearchSelectGroup>
    );
  },

  _renderOption(option, key) {
    let {
      optionRender: OptionRender,
    } = this.props;
    let { filterValue, suggestedOptionId } = this.state;

    let isSuggested = suggestedOptionId === option.id;

    return (
      <OptionRender
        className={classNames('SearchSelectOption', isSuggested && 'SearchSelectOption--suggested')}
        key={key}
        option={option}
        filter={filterValue}
        onClick={this._onOptionSelect.bind(null, option)}
      />
    );
  },

});

const SearchSelectGroup = React.createClass({

  displayName: 'SearchSelectGroup',

  propTypes: {
    label: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  },

  render() {
    let {label, isOpen, onClick, children, ...otherProps} = this.props;
    return (
      <div
        className={classNames("SearchSelectGroup", `SearchSelectGroup--${isOpen ? 'open' : 'closed'}`)}
        {...otherProps}
      >
        <div
          className="SearchSelectGroup-header"
          onClick={onClick}
        >
          <i className="SearchSelectGroup-headerIcon" />
          <span className="SearchSelectGroup-headerLabel">{label}</span>
        </div>
        <div className="SearchSelectGroup-options">
          {children}
        </div>
      </div>
    );
  },

});

SearchSelect.PropTypes = Select.PropTypes;

export default SearchSelect;
