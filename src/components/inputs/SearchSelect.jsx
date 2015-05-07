import React, { PropTypes, addons } from 'react/addons';
const { update } = addons;
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
      hideGroupsWithNoMatch: true,
      filterOption: (filter, option, group) => (new RegExp(filter, 'i').test(option.label)),
    };
  },

  getInitialState() {
    return {
      isFocused: false,
      filterValue: '',
      filteredOptions: this.props.options,
      openedGroupsId: [],
      suggestedOptionId: null,
    };
  },

  //Prop Helpers: value

  _removeSelection() {
    this.requestChange({ $set: null });
  },

  _selectOption(option) {
    this.requestChange({ $set: option });
    this._closeList();
  },

  //State Helpers: openedGroupsId

  _isGroupOpened(group) {
    return _.contains(this.state.openedGroupsId, group.id);
  },

  _toggleGroupOpenState(group) {
    let isOpened = this._isGroupOpened(group);
    if (isOpened) {
      this.setState({openedGroupsId: _.remove(this.state.openedGroupsId, group.id)});
    } else {
      this.setState({openedGroupsId: update(this.state.openedGroupsId, {$push: [group.id]})});
    }
  },

  _openAllGroups() {
    let {options} = this.props;
    let allGroupsIds = _.pluck(_.filter(options, 'isGroup'), 'id');
    this.setState({
      openedGroupsId: allGroupsIds,
    });
  },

  _closeAllGroups() {
    this.setState({
      openedGroupsId: [],
    });
  },

  //State Helpers: filterValue

  updateFilterValue(newFilterValue) {
    this.setState({filterValue: newFilterValue});
    let filteredOptions = this._updateFilteredOptions(newFilterValue);
    this._suggestFirstOption(filteredOptions);
  },

  _clearFilterValue() {
    console.log('_clearFilterValue');
    let newFilterValue = '';
    this.setState({filterValue: newFilterValue});
    this._updateFilteredOptions(newFilterValue);
    this._clearSuggestionOption();
  },

  //State Helpers: suggestedOption

  _suggestFirstOption(options) {
    let newSuggestion = options[0] && options[0].isGroup ? options[0].options[0] : options[0];
    if (newSuggestion) {
      this._setSuggestedOption(newSuggestion);
    } else {
      this._clearSuggestionOption();
    }
  },

  _setSuggestedOption(option) {
    this.setState({suggestedOptionId: option.id});
  },

  _clearSuggestionOption() {
    this.setState({suggestedOptionId: null});
  },

  //State Helpers: filteredOptions

  _updateFilteredOptions(filterValue) {
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

    this.setState({filteredOptions: options});

    return options;
  },

  //Element Helpers

  _openList() {
    this.setState({isFocused: true});
  },

  _closeList() {
    this._blurInput();
    this.setState({isFocused: false});
    this._closeAllGroups();
  },

  _blurInput() {
    let node = this.refs.searchInput.getDOMNode();
    node.blur();
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

  _onFilterInputChange(e) {
    let newValue = e.target.value;
    if (newValue === '') {
      this._onFilterInputBlur(e);
      return;
    }
    this._removeSelection();
    this.updateFilterValue(newValue);

    let previousValue = this.state.filterValue;
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

  //Renders

  render() {
    let {
      className,
      placeHolder,
      valueLink: {value},
    } = this.props;
    let { isFocused, filterValue, filteredOptions } = this.state;

    return (
      <div
        className={classNames('Select', `Select--${isFocused ? 'opened' : 'closed'}`, className)}
        onMouseLeave={this._onBlur}
      >
        <div className="Select-value">
          <input
            className="Select-filterInput"
            type="text"
            ref="searchInput"
            placeholder={placeHolder}
            value={filterValue}
            onFocus={this._onFocus}
            onBlur={this._onFilterInputBlur}
            onChange={this._onFilterInputChange}
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
    let isOpened = this._isGroupOpened(group);
    return (
      <div
        className={classNames("Select-group", `Select-group--${isOpened ? 'opened' : 'closed'}`)}
        key={key}
      >
        <div
          className="Select-groupHeader"
          onClick={this._toggleGroupOpenState.bind(null, group)}
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
    let { filterValue, suggestedOptionId } = this.state;

    let isSuggested = suggestedOptionId === option.id;

    return (
      <OptionRender
        className={classNames('Select-option', isSuggested && 'Select-option--suggested')}
        key={key}
        option={option}
        filter={filterValue}
        onClick={this._selectOption.bind(null, option)}
      />
    );
  },

});


Select.PropTypes = {
  option: optionPropType,
  optionGroupOf: optionGroupOf,
};

export default Select;
