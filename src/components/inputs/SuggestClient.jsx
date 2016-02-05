import React, { PropTypes } from 'react';
import cx from 'classnames';
import _ from 'lodash';

import SuggestSelect from './SuggestSelect';
import InputMixin from '../../mixins/InputMixin';


const SuggestClient = React.createClass({

  displayName: 'SuggestClient',

  propTypes: {
    suggestComponent: PropTypes.func.isRequired, // Component to render. either SuggestSelect or SuggestInput
    className: PropTypes.string,
    placeHolder: PropTypes.string,
    options: SuggestSelect.PropTypes.options.isRequired,
    // (val, option, parent) => Boolean. Return true to keep.
    filterOption: PropTypes.func, // By default filter option by their label.
    defaultListOpen: PropTypes.bool,
  },

  mixins: [
    InputMixin(SuggestSelect.PropTypes.optionId),
  ],

  getDefaultProps() {
    return {
      filterOption: (val, option, parent) => {
        const value = String(val).replace(/[\\\^\$\*\+\?\.\(\)\|\{\}\[\]]/g, '\\$&'); // Escape regex special characters
        const regex = new RegExp(value, 'i');
        return regex.test(option.label) || parent && regex.test(parent.label);
      },
    };
  },

  getInitialState() {
    return {
      filterValue: '',
    };
  },

  filterOptions(filterValue) {
    const {options, filterOption} = this.props;
    const filteredOptions = !filterValue ? options : this._filterOptions(filterOption, filterValue, options);
    return filteredOptions;
  },

  _filterOptions(filterOption, filterValue, options, parentOption) {
    return _.compact(_.map(options, option => {
      // Keep if option not selectable or filterOption function return true.
      const keepOption = option.isNotSelectable || filterOption(filterValue, option, parentOption);
      return keepOption && {
        ...option,
        options: option.isGroup ? this._filterOptions(filterOption, filterValue, option.options, option) : null,
      };
    }));
  },

  handleFilterChange(filterValue) {
    this.setState({ filterValue });
  },

  render() {
    const { suggestComponent: SuggestComponent, defaultListOpen, options, filterOption, className, ...otherProps } = this.props;
    const filteredOptions = this.filterOptions(this.state.filterValue);

    return (
      <SuggestComponent
        className={cx('SuggestClient', className)}
        options={filteredOptions}
        onFilterChange={this.handleFilterChange}
        defaultListOpen={defaultListOpen}
        { ...otherProps }
      />
    );
  },

});

export default SuggestClient;
