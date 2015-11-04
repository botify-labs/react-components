import React, { PropTypes } from 'react';
import UniqueIdMixin from '../../mixins/UniqueIdMixin';

const Mask = React.createClass({

  displayName: 'Mask',

  propTypes: {
    // Shape used to clip the Mask's children
    mask: PropTypes.node,
    style: PropTypes.object,
    children: PropTypes.node,
  },

  mixins: [UniqueIdMixin],

  render() {
    const { mask, children, style, ...otherProps } = this.props;

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
  },

});

export default Mask;
