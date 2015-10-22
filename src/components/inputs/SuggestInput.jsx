import React, { PropTypes } from 'react/addons';
import _ from 'lodash';
import cx from 'classnames';

import InputMixin from '../../mixins/InputMixin';
import StringInput from './StringInput';


const optionIdPropType = React.PropTypes.oneOfType([
  React.PropTypes.string,
  React.PropTypes.number,
]);

const optionPropType = PropTypes.shape({
  id: optionIdPropType.isRequired,
});

const optionsPropType = PropTypes.arrayOf(optionPropType);

const KEY_CODES = {
  TAB: 9,
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
};

const DefaultOption = React.createClass({

  displayName: 'Option',

  propTypes: {
    option: optionPropType.isRequired,
  },

  render() {
    let {
      option: {id},
      ...otherProps,
    } = this.props;

    return (
      <div className="Option" {...otherProps}>
        <span>{id}</span>
      </div>
    );
  },

});

const SuggestInput = React.createClass({

  displayName: 'SuggestInput',

  mixins: [
    InputMixin(optionIdPropType),
  ],

  propTypes: {
    className: PropTypes.string,
    input: PropTypes.func,
    options: optionsPropType.isRequired,
    optionRender: PropTypes.func,
    disabled: PropTypes.bool,
    onFilterChange: PropTypes.func,
  },

  //Life Cycle methods

  getDefaultProps() {
    return {
      input: StringInput,
      optionRender: DefaultOption,
      disabled: false,
      onFilterChange: (query) => {},
    };
  },

  getInitialState() {
    return {
      suggestionId: this.getValue(),
      isFocused: false,
      isListOpen: false,
    };
  },

  //Prop Helpers: isFocused
  focus() {
    this.setState({isFocused: true});
    this.openList();
  },

  blur() {
    this.setState({isFocused: false});
    this.closeList();
  },

  //Prop Helpers: isListOpen
  openList() {
    this.setState({isListOpen: true});
  },

  closeList() {
    this.setState({isListOpen: false});
  },

  suggestFirstOption() {
    let option = this.props.options[0];
    if (option) {
      this.setSuggestion(option);
    }
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
    const { options } = this.props;
    const { suggestion } = this.state;

    const currentSuggestionIndex = suggestion ? _.findIndex(options, option => option === suggestion) : -1;
    let movedSuggestionIndex = currentSuggestionIndex + n;
    movedSuggestionIndex = Math.min(Math.max(movedSuggestionIndex, 0), options.length - 1);

    this.setSuggestion(options[movedSuggestionIndex]);
  },

  setSuggestion(suggestion) {
    this.setState({ suggestionId: suggestion.id });
  },

  onInputKeyDown(e) {
    const {isListOpen} = this.state;

    if (!isListOpen) {
      this.openList();
      return;
    }

    switch (e.which) {
    case KEY_CODES.ENTER:
    case KEY_CODES.TAB:
      this.blur();
      break;
    case KEY_CODES.ARROW_UP:
      e.preventDefault();
      this.suggestPreviousOption();
      break;
    case KEY_CODES.ARROW_DOWN:
      e.preventDefault();
      this.suggestNextOption();
      break;
    }
  },

  componentWillReceiveProps(prevProps) {
    if (prevProps.options !== this.props.options) {
      this.suggestFirstOption();
    }
  },

  handleMouseDown(e) {
    if (e.button === 0 && this.state.isFocused) {
      // Only cancel blur on left click
      this._ignoreNextBlur = true;
    }
  },

  onInputBlur(e) {
    if (this._ignoreNextBlur) {
      this._ignoreNextBlur = false;
    } else {
      this.blur();
    }
  },

  onInputFocus(e) {
    const {isFocused} = this.state;

    if (!isFocused) {
      this.focus();
    }
  },

  onOptionSelect(option) {
    this.requestChange({ $set: option.id});
    this.blur();
  },

  onInputChange(value) {
    this.requestChange({ $set: value});
    this.props.onFilterChange(value);
  },

  render() {
    const { className, input: Input, options, disabled } = this.props;
    const { isFocused, isListOpen } = this.state;
    const value = this.getValue();

    return (
      <div
        className={cx(
          'SuggestInput',
          isFocused && 'SuggestInput--focused',
          disabled && 'SuggestInput--disabled',
          className
        )}
        onMouseDown={!disabled && this.handleMouseDown}
      >
        <Input
          className={cx('SuggestInput-input')}
          onBlur={this.onInputBlur}
          onFocus={this.onInputFocus}
          onKeyDown={this.onInputKeyDown}
          valueLink={this.link(value, this.onInputChange)}
        />
        {isListOpen &&
          <div
            className="SuggestInput-optionsList"
          >
            {_.map(options, this.renderOption)}
          </div>
        }
      </div>
    );
  },

  /**
   * @param  {optionProptype} option
   * @return {ReactClass}
   */
  renderOption(option) {
    let { optionRender: OptionRender } = this.props;
    let { filterValue, suggestedOptionId } = this.state;
    let isSuggested = suggestedOptionId === option.id;

    return (
      <OptionRender
        className={cx('SuggestInputSuggestion', isSuggested && 'SuggestInputSuggestion--suggested')}
        key={option.id}
        option={option}
        filter={filterValue}
        onClick={this.onOptionSelect.bind(null, option)}
      />
    );
  },

});

SuggestInput.PropTypes = {
  options: optionsPropType,
  option: optionPropType,
};

export default SuggestInput;
