import React, { PropTypes } from 'react';
import cx from 'classnames';
import _ from 'lodash';

import SuggestSelectBase from './SuggestSelectBase';
import InputMixin from '../../mixins/InputMixin';

const EMPTY_OPTIONS = [];

const SuggestSelectServer = React.createClass({

  displayName: 'SuggestSelectServer',

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
      options: EMPTY_OPTIONS,
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
      <SuggestSelectBase
        className={cx('SuggestSelectServer', className)}
        options={options}
        onFilterChange={this.feedOptions}
        { ...otherProps }
      />
    );
  },

});

export default SuggestSelectServer;
