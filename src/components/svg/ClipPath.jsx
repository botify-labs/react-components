import React from 'react';
import _ from 'lodash';
import UniqueIdMixin from './unique-id-mixin';

const ClipPath = React.createClass({

  mixins: [UniqueIdMixin],

  componentDidMount() {
    this._setClipPath();
  },

  componentDidUpdate() {
    this._setClipPath();
  },

  _setClipPath() {
    this.refs.group.getDOMNode().setAttribute('clip-path', `url(#${this._getId('clipPath')})`)
  },

  render() {
    return (
      <g>
        <clipPath id={this._getId('clipPath')}>
          {this.props.path}
        </clipPath>
        <g ref="group" {..._.omit(this.props, 'children', 'path')}>
          {this.props.children}
        </g>
      </g>
    );
  }

});

export default ClipPath;
