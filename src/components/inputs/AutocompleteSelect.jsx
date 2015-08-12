import React, { PropTypes } from 'react';
import cx from 'classnames';
import _ from 'lodash';

import SearchSelect from './SearchSelect';
import InputMixin from '../../mixins/InputMixin';


const AutocompleteSelect = React.createClass({

  displayName: 'AutocompleteSelect',

  propTypes: {
    className: PropTypes.string,
    feedOptions: PropTypes.func.isRequired, //Function called with (value: String, callback: Function) to feed suggestion
    debounce: PropTypes.number, //number of milliseconds to wait after last change to feed options
  },

  mixins: [
    InputMixin(React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ])),
  ],

  getInitialState() {
    return {
      options: [],
    };
  },

  componentWillMount() {
    let { debounce } = this.props;
    //First options populate
    this.feedOptions(this.getValue());
    //Debouce feedOptions function
    if (debounce) {
      this.feedOptions = _.debounce(this.feedOptions, debounce);
    }
  },

  feedOptions(newValue) {
    this.props.feedOptions(newValue, (err, options) => {
      if (!err) {
        this.setState({ options });
      }
    });
  },

  render() {
    let { feedOptions, debounce, className, ...otherProps } = this.props;
    let { options } = this.state;
    return (
      <SearchSelect
        className={cx('AutocompleteSelect', className)}
        options={options}
        placeHolder=""
        onQueryChange={this.feedOptions}
        { ...otherProps }
      />
    );
  },

});

export default AutocompleteSelect;
