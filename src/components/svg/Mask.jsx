import React from 'react';
import _ from 'lodash';
import UniqueIdMixin from './UniqueIdMixin';

const Mask = React.createClass({

  mixins: [UniqueIdMixin],

  render() {
    let { mask, children, style, ...otherProps } = this.props;

    return (
      <g>
        <mask id={this._getId('mask')}>
          {this.props.mask}
        </mask>
        <g {...otherProps} style={{ ...style, mask: `url(#${this._getId('mask')})` }}>
          {this.props.children}
        </g>
      </g>
    );
  }

});

export default Mask;
