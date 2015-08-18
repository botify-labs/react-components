import React, { PropTypes } from 'react';
import cx from 'classnames';
import _ from 'lodash';

import SuggestSelectBase from './SuggestSelectBase';
import InputMixin from '../../mixins/InputMixin';


const DEFAULT_PLACEHOLDER = 'Search option';

const SuggestSelectClient = React.createClass({

  displayName: 'SuggestSelectClient',

  propTypes: {
    className: PropTypes.string,
    placeHolder: PropTypes.string,
    options: SuggestSelectBase.PropTypes.options.isRequired,
    //(val, option, parent) => Boolean. Return true to keep.
    filterOption: PropTypes.func, //By default filter option by their label.
  },

  getDefaultProps() {
    return {
      placeHolder: DEFAULT_PLACEHOLDER,
      filterOption: (val, option, parent) => {
        val = val.replace(/[\\\^\$\*\+\?\.\(\)\|\{\}\[\]]/g, '\\$&'); //Escape regex special characters
        return new RegExp(val, 'i').test(option.label);
      },
    };
  },

  getInitialState() {
    return {
      filteredOptions: this.props.options,
    };
  },

  mixins: [
    InputMixin(React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ])),
  ],

  handleFilterChange(filterValue) {
    this.setState({
      filteredOptions: this.filterOptions(filterValue),
    });
  },

  filterOptions(filterValue) {
    let {options, filterOption} = this.props;
    let filteredOptions = !filterValue ? options : this._filterOptions(filterOption, filterValue, options);
    return filteredOptions;
  },

  _filterOptions(filterOption, filterValue, options, parentOption) {
    return _.compact(_.map(options, option => {
      //Filter if option selectable and filterOption function return true.
      let keepOption = option.isNotSelectable ? true : filterOption(filterValue, option, parentOption);
      return keepOption && {
        ...option,
        options: option.isGroup ? this._filterOptions(filterOption, filterValue, option.options, option) : null,
      };
    }));
  },

  render() {
    let { options, filterOption, className, ...otherProps } = this.props;
    let { filteredOptions } = this.state;
    return (
      <SuggestSelectBase
        className={cx('SuggestSelectClient', className)}
        options={filteredOptions}
        onFilterChange={this.handleFilterChange}
        { ...otherProps }
      />
    );
  },

});

export default SuggestSelectClient;
