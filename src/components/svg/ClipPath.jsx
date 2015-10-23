import React, { PropTypes } from 'react';
import UniqueIdMixin from '../../mixins/UniqueIdMixin';

const ClipPath = React.createClass({

  displayName: 'ClipPath',

  propTypes: {
    // Shape used to clip the ClipPath's children
    path: PropTypes.element,
    children: PropTypes.node,
    style: PropTypes.object,
  },

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
  },

});

export default ClipPath;
