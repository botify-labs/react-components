import React, {PropTypes} from 'react';
import _ from 'lodash';

import 'font-awesome/css/font-awesome.css';
import SearchSelect from '../src/components/inputs/SearchSelect';

import './SearchSelect.scss';

let options = [
  {
    id: 'foo',
    label: 'foo',
    isGroup: true,
    options: [
      {id: 'foo1', label: 'foo 1', type: 'string', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
      {id: 'foo2', label: 'foo 2', type: 'string', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
      {id: 'foo3', label: 'foo 3', type: 'integer', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
      {id: 'foo4', label: 'foo 4', type: 'string', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
    ],
  },
  {
    id: 'bar',
    label: 'bar',
    isGroup: true,
    options: [
      {id: 'bar1', label: 'bar 1', type: 'string', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
      {id: 'bar2', label: 'bar 2', type: 'string', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
      {id: 'bar3', label: 'bar 3', type: 'integer', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
      {id: 'bar4', label: 'bar 4', type: 'string', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
    ],
  },
  {id: 'bar1', label: 'bar1', type: 'string', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
];

let match = (query, optionGroups) => {
  let _options = _.flatten(_.pluck(optionGroups, 'options')),
      queryRegex = new RegExp(query, 'i');
  return _.filter(_options, queryRegex.test(options.label));
};

let OptionExample = React.createClass({

  displayName: 'OptionExample',

  propTypes: {
    option: PropTypes.shape({
      ...SearchSelect.optionPropType,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired,
    query: PropTypes.string.isRequired,
  },

  render() {
    let {
      option: {label, type, description},
      ...otherProps,
    } = this.props;

    return (
      <div className="OptionExample" {...otherProps}>
        <span>{label}</span>
        <div className="OptionExample-info">
          <span className="OptionExample-type">{type}</span>
          <span className="OptionExample-description">{description}</span>
        </div>
      </div>
    );
  },

});


let defaultValue = options[0].options[2];

let render = (value) => {
  React.render(
    <div>
      <SearchSelect
        placeHolder="Search a field"
        options={options}
        optionRender={OptionExample}
        filterOptions={match}
        valueLink={{
          value: value,
          requestChange(newValue) {
            render(newValue);
          },
       }}
      />
      <span>Text below Select</span>
    </div>
  , document.getElementById('container'));
};
render(defaultValue);
