import React, { PropTypes } from 'react';
import cx from 'classnames';
import _ from 'lodash';

import SuggestSelect from './SuggestSelect';
import InputMixin from '../../mixins/InputMixin';


const DEFAULT_PLACEHOLDER = 'Search option';

const SuggestClient = React.createClass({

  displayName: 'SuggestClient',

  propTypes: {
    suggestComponent: PropTypes.func.isRequired, //Component to render. either SuggestSelect or SuggestInput
    className: PropTypes.string,
    placeHolder: PropTypes.string,
    options: SuggestSelect.PropTypes.options.isRequired,
    //(val, option, parent) => Boolean. Return true to keep.
    filterOption: PropTypes.func, //By default filter option by their label.
  },

  mixins: [
    InputMixin(SuggestSelect.PropTypes.optionId),
  ],

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
      filterValue: '',
    };
  },

  handleFilterChange(filterValue) {
    this.setState({ filterValue });
  },

  filterOptions(filterValue) {
    let {options, filterOption} = this.props;
    let filteredOptions = !filterValue ? options : this._filterOptions(filterOption, filterValue, options);
    return filteredOptions;
  },

  _filterOptions(filterOption, filterValue, options, parentOption) {
    return _.compact(_.map(options, option => {
      //Keep if option not selectable or filterOption function return true.
      let keepOption = option.isNotSelectable || filterOption(filterValue, option, parentOption);
      return keepOption && {
        ...option,
        options: option.isGroup ? this._filterOptions(filterOption, filterValue, option.options, option) : null,
      };
    }));
  },

  render() {
    let { suggestComponent: SuggestComponent, options, filterOption, className, ...otherProps } = this.props;
    let filteredOptions = this.filterOptions(this.state.filterValue);

    return (
      <SuggestComponent
        className={cx('SuggestClient', className)}
        options={filteredOptions}
        onFilterChange={this.handleFilterChange}
        { ...otherProps }
      />
    );
  },

});

export default SuggestClient;
