import React, { PropTypes } from 'react';

const dim = 10000;
const fullShape = [
  `M ${-dim} ${-dim}`,
  `L ${dim} ${-dim}`,
  `L ${dim} ${dim}`,
  `L ${-dim} ${dim}`,
  `Z`,
].join(' ');

const Path = React.createClass({

  displayName: 'Path',

  propTypes: {
    // Is this an inversed shape?
    inverse: PropTypes.bool,
    style: PropTypes.object,
    // Path data, see http://www.w3.org/TR/SVG/paths.html#PathData
    d: PropTypes.string,
  },

  render() {
    const { inverse, ...otherProps } = this.props;
    let { d, style = {} } = this.props;
    if (inverse) {
      d = fullShape + d;
      style = { ...style, fillRule: 'evenodd' };
    }

    return <path {...otherProps} d={d} style={style}/>;
  },

});

export default Path;
