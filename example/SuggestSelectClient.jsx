import React, {PropTypes} from 'react';

import 'font-awesome/css/font-awesome.css';
import SuggestSelectClient from '../src/components/inputs/SuggestSelectClient';

import './SuggestSelectClient.scss';


const options = [
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
  {id: 'boo', label: 'boo', type: 'string', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
];

const OptionExample = React.createClass({

  displayName: 'OptionExample',

  propTypes: {
    className: PropTypes.string.isRequired,
    option: PropTypes.shape({
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired,
    filter: PropTypes.string.isRequired,
  },

  render() {
    const {
      className,
      option: {label, type, description},
      ...otherProps,
    } = this.props;

    return (
      <div className={className} {...otherProps}>
        <span className="OptionExample-label">{label}</span>
        <div className="OptionExample-info">
          <span className="OptionExample-type">{type}</span>
          <span className="OptionExample-description">{description}</span>
        </div>
      </div>
    );
  },

});


const defaultValue = null;

const render = (value) => {
  React.render(
    <div>
      <input type="text"/>
      <SuggestSelectClient
        placeHolder="Search a field"
        options={options}
        optionRender={OptionExample}
        valueLink={{
          value,
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
