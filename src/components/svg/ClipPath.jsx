import React from 'react';
import _ from 'lodash';
import UniqueIdMixin from './UniqueIdMixin';

const ClipPath = React.createClass({

  mixins: [UniqueIdMixin],

  render() {
    let { path, children, style, ...otherProps } = this.props;

    return (
      <g>
        <clipPath id={this._getId('clipPath')}>
          {path}
        </clipPath>
        <g {...otherProps} style={{...style, clipPath: `url(#${this._getId('clipPath')})`}} >
          {children}
        </g>
      </g>
    );
  }

});

export default ClipPath;
