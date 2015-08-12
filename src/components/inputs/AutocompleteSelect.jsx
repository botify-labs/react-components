import React, { PropTypes } from 'react';
import cx from 'classnames';

import SearchSelect from './SearchSelect';


const AutocompleteSelect = React.createClass({

  displayName: 'AutocompleteSelect',

  propTypes: {
    className: PropTypes.string,
    feedOptions: PropTypes.func.isRequired, //Function called with (value: String, callback: Function) to feed suggestion
  },

  getInitialState() {
    return {
      options: [],
    };
  },

  handleQueryChange(newValue) {
    this.props.feedOptions(newValue, (err, options) => {
      if (!err) {
        this.setState({ options });
      }
    });
  },

  render() {
    let { feedOptions, className, ...otherProps } = this.props;
    let { options } = this.state;
    return (
      <SearchSelect
        className={cx('AutocompleteSelect', className)}
        options={options}
        placeHolder=""
        onQueryChange={this.handleQueryChange}
        { ...otherProps }
      />
    );
  },

});

export default AutocompleteSelect;
