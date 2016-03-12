import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import _ from 'lodash';
import cx from 'classnames';

import InputMixin from '../../mixins/InputMixin';


const optionIdPropType = React.PropTypes.oneOfType([
  React.PropTypes.string,
  React.PropTypes.number,
]);

const optionPropType = PropTypes.shape({
  id: optionIdPropType.isRequired,
  label: PropTypes.string.isRequired,
  labelSelected: PropTypes.string, // Label displayed when selected
});

const optionGroupPropType = PropTypes.oneOfType([
  PropTypes.shape({
    id: optionIdPropType.isRequired,
    label: PropTypes.string.isRequired,
    labelSelected: PropTypes.string, // Label displayed when selected
    options: PropTypes.arrayOf(optionPropType).isRequired,
    isGroup: PropTypes.bool.isRequired,
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
    const {
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

  propTypes: {
    className: PropTypes.string,
    placeHolder: PropTypes.string,
    options: optionsPropType.isRequired,
    optionRender: PropTypes.func,
    hideGroupsWithoutOptions: PropTypes.bool,
    disabled: PropTypes.bool,
    onFilterChange: PropTypes.func, // Called when input value (query) change. Whereas valueLink.requestChange is called when an option is selected.
    defaultListOpen: PropTypes.bool,
  },

  mixins: [
    InputMixin(optionIdPropType),
  ],

  // Life Cycle methods

  getDefaultProps() {
    return {
      placeHolder: '',
      optionRender: OptionDefault,
      hideGroupsWithoutOptions: true,
      disabled: false,
      onFilterChange: (query) => {},
    };
  },

  getInitialState() {
    return {
      filterValue: '',
      suggestedOptionId: this.getValue(),
      isFocused: false,
      isListOpen: this.props.defaultListOpen,
      openGroupsId: [],
    };
  },

  componentDidUpdate(prevProps, prevState) {
    const {isFocused, suggestedOptionId, filterValue} = this.state;
    const selectedOptionId = this.getSelectedOptionId();
    const previousSelectedOptionId = this.getSelectedOptionId(prevProps);

    if (prevState.isFocused !== isFocused) {
      if (isFocused) {
        // If became focused, open the list
        this.openList();
        this.openParentsGroupIfNot(suggestedOptionId);
      } else {
        // If became blurred, clear the select
        this.clearFilterValue();
        this.closeAllGroups();
        this.closeList();
      }
    }

    // If new value, Clear select without bluring
    if (previousSelectedOptionId !== selectedOptionId) {
      this.clearFilterValue();
      this.closeAllGroups();
      this.closeList();
      this.setSuggestedOptionId(selectedOptionId);
    }

    if (prevProps.options !== this.props.options) {
      this.openList();
      ReactDOM.findDOMNode(this.refs.searchInput).focus();

      if (filterValue) {
        this.suggestFirstOption();
      }
    }

    if (prevState.filterValue !== filterValue) {
      if (!filterValue && !selectedOptionId) {
        this.clearSuggestedOption();
      }

      // Select first option if not setted whereas filterValue is not empty
      if (filterValue && !selectedOptionId) {
        this.suggestFirstOption();
      }

      // Open all groups if filterValue was empty
      const filterValueWasEmpty = prevState.filterValue.length === 0 && filterValue.length > 0;
      if (filterValueWasEmpty) {
        this.openAllGroups();
      }

      // Close all groups if filterValue become empty
      const filterValueBecomeEmpty = prevState.filterValue.length > 0 && filterValue.length === 0;
      if (filterValueBecomeEmpty) {
        this.closeAllGroups();
      }
    }

    // Focus input is state isFocused
    // Note: I cannot be done in the setstate callback as when the user clicks somewhere on the list,
    //       the input is blurred, so we need to refocus it.
    if (isFocused) {
      ReactDOM.findDOMNode(this.refs.searchInput).focus();
    }
  },

  // Prop Helpers: isFocused
  focus() {
    this.setState({isFocused: true});
  },
  blur() {
    this.setState({isFocused: false});
  },

  // Prop Helpers: isListOpen
  openList() {
    this.setState({isListOpen: true});
  },
  closeList() {
    this.setState({isListOpen: false});
  },

  // Prop Helpers: value
  selectOption(optionId) {
    this.requestChange({ $set: optionId });
    this.blur();
  },
  getSelectedOptionId(props) {
    return this.getValue(props);
  },

  // State Helpers: openGroupsId
  isGroupOpen(group) {
    const {openGroupsId} = this.state;
    return _.contains(openGroupsId, group.id);
  },
  toggleGroupOpenState(group) {
    const isOpened = this.isGroupOpen(group);
    if (isOpened) {
      this.closeGroup(group);
    } else {
      this.openGroup(group);
    }
  },
  openGroup(group) {
    const { openGroupsId } = this.state;
    this.setState({ openGroupsId: update(openGroupsId, {$push: [group.id]}) });
  },
  closeGroup(group) {
    const { openGroupsId } = this.state;
    const index = _.findIndex(openGroupsId, (id) => id === group.id);
    this.setState({ openGroupsId: update(openGroupsId, {$splice: [[index, 1]]}) });
  },
  openParentsGroupIfNot(optionId) {
    let option = _.find(this.getOptionsIterator(), opt => opt.id === optionId);
    while (option && option.parent && !this.isGroupOpen(option.parent)) {
      this.openGroup(option.parent);
      option = option.parent;
    }
  },
  openAllGroups() {
    const allGroupsIds = _.pluck(_.filter(this.getOptionsIterator(), 'isGroup'), 'id');
    this.setState({ openGroupsId: allGroupsIds });
  },
  closeAllGroups() {
    this.setState({ openGroupsId: [] });
  },

  // State Helpers: filterValue
  updateFilterValue(newFilterValue) {
    this.setState({filterValue: newFilterValue});
    this.props.onFilterChange(newFilterValue);
  },
  clearFilterValue() {
    this.updateFilterValue('');
  },

  // State Helpers: suggestedOptionId
  suggestFirstOption() {
    const suggestion = this.getOptionsIterator()[0];
    this.setSuggestedOption(suggestion);
  },
  suggestPreviousOption() {
    this.moveSuggestion(-1);
  },
  suggestNextOption() {
    this.moveSuggestion(1);
  },
  /**
   * @param  {Integer} n
   */
  moveSuggestion(n) {
    const {suggestedOptionId} = this.state;
    const optionsIterator = this.getOptionsIterator();

    const currentSuggestionIndex = suggestedOptionId ? _.findIndex(optionsIterator, option => option.id === suggestedOptionId) : -1;
    let movedSuggestionIndex = currentSuggestionIndex + n;

    movedSuggestionIndex = Math.min(Math.max(movedSuggestionIndex, 0), optionsIterator.length - 1);

    this.setSuggestedOption(optionsIterator[movedSuggestionIndex]);
  },
  setSuggestedOption(option) {
    this.setSuggestedOptionId(option ? option.id : null);
  },
  setSuggestedOptionId(optionId) {
    this.setState({suggestedOptionId: optionId});
    this.openParentsGroupIfNot(optionId);
  },
  clearSuggestedOption() {
    this.setSuggestedOptionId(null);
  },

  // Prop Helpers: options
  getOption(optionId) {
    return _.find(this.getOptionsIterator(), {id: optionId});
  },
  getOptionsIterator() {
    return this._getOptionsIterator(this.props.options);
  },
  _getOptionsIterator(options, parentOption) {
    return _.flatten(_.map(options, (option) => {
      const optionIterator = {...option, parent: parentOption};
      return []
        .concat(optionIterator.isNotSelectable ? [] : optionIterator)
        .concat(this._getOptionsIterator(optionIterator.options, optionIterator) || []);
    }));
  },


  // Elements Listeners
  onInputContainerClick(e) {
    const { isListOpen, isFocused } = this.state;

    if (isFocused) {
      this.blur();
    } else {
      this.focus();
    }

    if (isListOpen) {
      this.closeList();
    } else {
      this.openList();
    }
  },

  handleMouseDown(e) {
    if (e.button === 0 && this.state.isFocused) {
      //  Only cancel blur on left click
      this._ignoreNextBlur = true;
    }
  },

  onFilterInputBlur(e) {
    if (this._ignoreNextBlur) {
      this._ignoreNextBlur = false;
    } else {
      this.blur();
      this.closeList();
    }
  },

  onFilterInputFocus(e) {
    const { isListOpen, isFocused } = this.state;

    if (!isFocused) {
      this.focus();
    }
    if (!isListOpen) {
      this.openList();
    }
  },

  onFilterInputChange(e) {
    const value = e.target.value;
    this.updateFilterValue(value);
  },

  onFilterInputKeyDown(e) {
    const {isListOpen, suggestedOptionId} = this.state;

    if (!isListOpen) {
      this.openList();
      return;
    }

    switch (e.which) {
    case KEY_CODES.ENTER:
    case KEY_CODES.TAB:
      if (suggestedOptionId) {
        this.selectOption(suggestedOptionId);
      }
      break;
    case KEY_CODES.ARROW_UP:
      e.preventDefault();
      this.suggestPreviousOption();
      break;
    case KEY_CODES.ARROW_DOWN:
      e.preventDefault();
      this.suggestNextOption();
      break;
    default: break;
    }
  },

  onToggleGroupOpen(group, e) {
    this.toggleGroupOpenState(group);
  },

  onOptionSelect(option, e) {
    this.selectOption(option.id);
  },

  // Renders

  render() {
    const { className, placeHolder, disabled, options } = this.props;
    const { isFocused, isListOpen, filterValue } = this.state;

    const selectedOptionId = this.getSelectedOptionId();
    const selectedOption = this.getOption(selectedOptionId);

    return (
      <div
        className={cx(
          'SuggestSelect',
          isFocused && 'SuggestSelect--focused',
          disabled && 'SuggestSelect--disabled',
          className
        )}
        onMouseDown={!disabled && this.handleMouseDown}
      >
        <div className="SuggestSelect-inputContainer"
          onClick={!disabled && this.onInputContainerClick}
        >
          <input
            className={cx('SuggestSelect-filterInput', !filterValue && 'SuggestSelect-filterInput--empty')}
            type="text"
            ref="searchInput"
            disabled={disabled}
            value={filterValue}
            onBlur={this.onFilterInputBlur}
            onChange={this.onFilterInputChange}
            onKeyDown={this.onFilterInputKeyDown}
            onFocus={this.onFilterInputFocus}
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
              const render = option.isGroup ? this._renderGroup : this._renderOption;
              return render(option, 0);
            })}
          </div>
        }
      </div>
    );
  },

  _renderGroup(group, depth) {
    const { optionRender: OptionRender, hideGroupsWithoutOptions } = this.props;
    const { filterValue, suggestedOptionId } = this.state;
    const isSuggested = suggestedOptionId === group.id;
    const isOpen = this.isGroupOpen(group);

    if (hideGroupsWithoutOptions && (!group.options || group.options.length === 0)) {
      return false;
    }

    return (
      <SuggestSelectGroup
        className={`SuggestSelectGroup--depth${depth}`}
        key={group.id}
        group={group}
        isOpen={isOpen}
        isSuggested={isSuggested}
        isSelectable={!group.isNotSelectable}
        optionRender={OptionRender}
        filter={filterValue}
        onToggleOpen={this.onToggleGroupOpen.bind(null, group)}
        onOptionSelect={this.onOptionSelect.bind(null, group)}
      >
        {isOpen && _.map(group.options, (option) => {
          const render = option.isGroup ? this._renderGroup : this._renderOption;
          return render(option, depth + 1);
        })}
      </SuggestSelectGroup>
    );
  },

  _renderOption(option, depth) {
    const { optionRender: OptionRender } = this.props;
    const { filterValue, suggestedOptionId } = this.state;
    const isSuggested = suggestedOptionId === option.id;

    return (
      <OptionRender
        className={cx('SuggestSelectOption', isSuggested && 'SuggestSelectOption--suggested', `SuggestSelectOption--depth${depth}`)}
        key={option.id}
        option={option}
        filter={filterValue}
        onClick={this.onOptionSelect.bind(null, option)}
      />
    );
  },

});

const SuggestSelectGroup = React.createClass({

  displayName: 'SuggestSelectGroup',

  propTypes: {
    className: PropTypes.string,
    group: optionGroupPropType,
    isOpen: PropTypes.bool.isRequired,
    isSuggested: PropTypes.bool.isRequired,
    isSelectable: PropTypes.bool.isRequired,
    optionRender: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    onToggleOpen: PropTypes.func.isRequired,
    onOptionSelect: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  },

  render() {
    const {group, isOpen, isSuggested, optionRender: OptionRender, className,
      filter, isSelectable, onToggleOpen, onOptionSelect, children, ...otherProps} = this.props;
    return (
      <div
        className={cx(className, 'SuggestSelectGroup', `SuggestSelectGroup--${isOpen ? 'open' : 'closed'}`)}
        {...otherProps}
      >
        <div className={cx('SuggestSelectGroup-header', isSuggested && 'SuggestSelectGroup--suggested', isSelectable && 'SuggestSelectGroup--selectable')}>
          <i
            className={`SuggestSelectGroup-headerIcon SuggestSelectGroup-headerIcon--${isOpen ? 'open' : 'closed'}`}
            onClick={onToggleOpen}
          />
          <OptionRender
            className="SuggestSelectGroup-headerLabel"
            option={group}
            filter={filter}
            onClick={onToggleOpen}
          />
          {isSelectable &&
            <span
              className="SuggestSelectGroup-headerSelect"
              onClick={onOptionSelect}
            >
              Select
            </span>
          }
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
  optionId: optionIdPropType,
};

export default SuggestSelect;
