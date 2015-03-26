import React from 'react';
import _ from 'lodash';
import UniqueIdMixin from './UniqueIdMixin';

const Mask = React.createClass({

  displayName: 'Mask',

  mixins: [UniqueIdMixin],

  propTypes: {
    // Shape used to clip the Mask's children
    mask: React.PropTypes.node
  },

  render() {
    let { mask, children, style, ...otherProps } = this.props;

    return (
      <g>
        <mask id={this._getId('mask')}>
          {mask}
        </mask>
        <g {...otherProps} style={{ ...style, mask: `url(#${this._getId('mask')})` }}>
          {children}
        </g>
      </g>
    );
  }

});

export default Mask;
