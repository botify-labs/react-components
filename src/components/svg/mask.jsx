import React from 'react';
import _ from 'lodash';
import UniqueIdMixin from './unique-id-mixin';

const Mask = React.createClass({

  mixins: [UniqueIdMixin],

  componentDidMount() {
    this._setMask();
  },

  componentDidUpdate() {
    this._setMask();
  },

  _setMask() {
    this.refs.group.getDOMNode().setAttribute('mask', `url(#${this._getId('mask')})`)
  },

  render() {
    return (
      <g>
        <mask id={this._getId('mask')}>
          {this.props.mask}
        </mask>
        <g ref="group" {..._.omit(this.props, 'children', 'mask')}>
          {this.props.children}
        </g>
      </g>
    );
  }

});

export default Mask;
