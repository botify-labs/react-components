import React, { PropTypes, addons } from 'react/addons';
const { update } = addons;
import _ from 'lodash';
import classNames from 'classnames';

import Select from './Select';
import InputMixin from '../../mixins/InputMixin';



const optionPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelSelected: PropTypes.string, //Label displayed when selected
});

const optionGroupPropType = PropTypes.oneOfType([
  PropTypes.shape({
    isGroup: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    labelSelected: PropTypes.string, //Label displayed when selected
    options: PropTypes.arrayOf(optionPropType).isRequired,
    isNotSelectable: PropTypes.bool,
  }),
  optionPropType,
]);

const optionsPropType = PropTypes.arrayOf(optionGroupPropType);

const KEY_CODES = {
  TAB: 9,
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
};

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

const SuggestSelect = React.createClass({

  displayName: 'SuggestSelect',

  mixins: [
    InputMixin(React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ])),
  ],

  propTypes: {
    className: PropTypes.string,
    placeHolder: PropTypes.string,
    options: optionsPropType.isRequired,
    optionRender: PropTypes.func,
    hideGroupsWithoutOptions: PropTypes.bool,
    disabled: PropTypes.bool,
    onFilterChange: PropTypes.func, //Called when input value (query) change. Whereas valueLink.requestChange is called when an option is selected.
  },

  //Life Cycle methods

  getDefaultProps() {
    return {
      placeHolder: '',
      optionRender: OptionDefault,
      hideGroupsWithoutOptions: true,
      disabled: false,
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

  fireFilterChange(value) {
    if (this.props.onFilterChange) {
      this.props.onFilterChange(value);
    }
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
  _updateFilterValue(newFilterValue, fireChange = true) {
    this.setState({filterValue: newFilterValue});
    if (fireChange) {
      this.fireFilterChange(newFilterValue);
    }
  },
  _clearFilterValue(fireChange) {
    this._updateFilterValue('', fireChange);
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
    return _.find(this._getOptionsIterator(), {id: optionId});
  },
  _getOptionsIterator(options = this.props.options) {
    return _.flatten(_.map(options, (option) => option.isGroup ? this._getOptionsIterator(option.options) : option));
  },

  //Elements Listeners
  _onInputContainerClick(e) {
    this._focus();
    //Open the list as list might be already open.
    this._openList();
  },

  _handleMouseDown(e) {
    if (e.button === 0 && this.state.isFocused) {
      // Only cancel blur on left click
      this._ignoreNextBlur = true;
    }
  },

  _onFilterInputBlur(e) {
    if (this._ignoreNextBlur) {
      this._ignoreNextBlur = false;
    } else {
      this._blur();
      this._closeList();
    }
  },

  _onFilterInputFocus(e) {
    let {isListOpen, isFocused} = this.state;

    if (!isFocused) {
      this._focus();
    }
    if (!isListOpen) {
      this._openList();
    }
  },

  _onFilterInputChange(e) {
    let value = e.target.value;
    this._updateFilterValue(value);
  },

  _onFilterInputKeyDown(e) {
    let {isListOpen, suggestedOptionId} = this.state;

    if (!isListOpen) {
      this._openList();
      return;
    }

    switch (e.which) {
    case KEY_CODES.ENTER:
    case KEY_CODES.TAB:
      if (suggestedOptionId) {
        this._selectOption(suggestedOptionId);
      }
      break;
    case KEY_CODES.ARROW_UP:
      e.preventDefault();
      this._suggestPreviousOption();
      break;
    case KEY_CODES.ARROW_DOWN:
      e.preventDefault();
      this._suggestNextOption();
      break;
    }
  },

  _onToggleGroupOpen(group, e) {
    this._toggleGroupOpenState(group);
  },

  _onOptionSelect(option, e) {
    this._selectOption(option.id);
  },

  componentDidUpdate(prevProps, prevState) {
    let {isFocused, suggestedOptionId, filterValue} = this.state;
    let selectedOptionId = this._getSelectedOptionId(),
        previousSelectedOptionId = this._getSelectedOptionId(prevProps);

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
        this._clearFilterValue(false);
        this._closeAllGroups();
        this._closeList();
        this._setSuggestedOptionId(selectedOptionId);
      }
    }

    if (prevProps.options !== this.props.options) {
      if (filterValue) {
        this._suggestFirstOption(filterValue);
      }
    }

    if (prevState.filterValue !== filterValue) {

      /*if (!filterValue && !selectedOptionId) {
        this._clearSuggestedOption();
      }*/

      //Select first option if not setted whereas filterValue is not empty
      // and remove selection (clear value) when the filtreValue change
      /*if (filterValue) {
        this._suggestFirstOption(filterValue);
      }*/

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

  //Renders

  render() {
    let { className, placeHolder, disabled, options } = this.props;
    let { isFocused, isListOpen, filterValue } = this.state;

    let selectedOptionId = this._getSelectedOptionId();
    let selectedOption = this._getOption(selectedOptionId);

    return (
      <div
        className={classNames(
          'SuggestSelect',
          isFocused && 'SuggestSelect--focused',
          disabled && 'SuggestSelect--disabled',
          className
        )}
        onMouseDown={!disabled && this._handleMouseDown}
      >
        <div className="SuggestSelect-inputContainer"
          onClick={!disabled && this._onInputContainerClick}
        >
          <input
            className={classNames('SuggestSelect-filterInput', !filterValue && 'SuggestSelect-filterInput--empty')}
            type="text"
            ref="searchInput"
            disabled={disabled}
            value={filterValue}
            onBlur={this._onFilterInputBlur}
            onChange={this._onFilterInputChange}
            onKeyDown={this._onFilterInputKeyDown}
            onFocus={this._onFilterInputFocus}
          />
          {!filterValue &&
            (selectedOption ?
              <span className="SuggestSelect-valueSpan">{selectedOption.labelSelected || selectedOption.label}</span> :
              <span className="SuggestSelect-placeholder">{placeHolder}</span>
            )
          }
        </div>
        {isListOpen &&
          <div
            className="SuggestSelect-optionsList"
          >
            {_.map(options, (option) => {
              let render = option.isGroup ? this._renderGroup : this._renderOption;
              return render(option);
            })}
          </div>
        }
      </div>
    );
  },

  _renderGroup(group) {
    let { optionRender: OptionRender, hideGroupsWithoutOptions } = this.props;
    let { filterValue, suggestedOptionId } = this.state;
    let isSuggested = suggestedOptionId === group.id;

    if (hideGroupsWithoutOptions && (!group.options || group.options.length === 0)) {
      return false;
    }

    return (
      <SuggestSelectGroup
        key={group.id}
        group={group}
        isOpen={this._isGroupOpen(group)}
        isSuggested={isSuggested}
        optionRender={OptionRender}
        filter={filterValue}
        isGroupSelectable={!group.isNotSelectable}
        onToggleOpen={this._onToggleGroupOpen.bind(null, group)}
        onOptionSelect={this._onOptionSelect.bind(null, group)}
      >
        {_.map(group.options, (option) => {
          let render = option.isGroup ? this._renderGroup : this._renderOption;
          return render(option);
        })}
      </SuggestSelectGroup>
    );
  },

  _renderOption(option) {
    let { optionRender: OptionRender } = this.props;
    let { filterValue, suggestedOptionId } = this.state;
    let isSuggested = suggestedOptionId === option.id;

    return (
      <OptionRender
        className={classNames('SuggestSelectOption', isSuggested && 'SuggestSelectOption--suggested')}
        key={option.id}
        option={option}
        filter={filterValue}
        onClick={this._onOptionSelect.bind(null, option)}
      />
    );
  },

});

const SuggestSelectGroup = React.createClass({

  displayName: 'SuggestSelectGroup',

  propTypes: {
    group: Select.PropTypes.optionGroupOf(Select.PropTypes.option),
    isOpen: PropTypes.bool.isRequired,
    isSuggested: PropTypes.bool.isRequired,
    optionRender: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    isGroupSelectable: PropTypes.bool.isRequired,
    onToggleOpen: PropTypes.func.isRequired,
    onOptionSelect: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  },

  render() {
    let {group, isOpen, isSuggested, optionRender: OptionRender, filter, isGroupSelectable, onToggleOpen, onOptionSelect, children, ...otherProps} = this.props;
    return (
      <div
        className={classNames('SuggestSelectGroup', `SuggestSelectGroup--${isOpen ? 'open' : 'closed'}`, isSuggested && 'SuggestSelectGroup--suggested')}
        {...otherProps}
      >
        <div className="SuggestSelectGroup-header">
          <i className={`SuggestSelectGroup-headerIcon SuggestSelectGroup-headerIcon--${isOpen ? 'open' : 'closed'}`} onClick={onToggleOpen} />
          <OptionRender
            className="SuggestSelectGroup-headerLabel"
            option={group}
            filter={filter}
            onClick={isGroupSelectable ? onOptionSelect : onToggleOpen}
          />
        </div>
        <div className="SuggestSelectGroup-options">
          {children}
        </div>
      </div>
    );
  },

});

SuggestSelect.PropTypes = {
  options: optionsPropType,
  optionGroup: optionGroupPropType,
  option: optionPropType,
};

export default SuggestSelect;
