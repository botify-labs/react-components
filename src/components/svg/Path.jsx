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
    const { inverse, d, style = {}, ...otherProps } = this.props;
    let pathStyle = style;
    let move = d;
    if (inverse) {
      move = fullShape + move;
      pathStyle = { ...pathStyle, fillRule: 'evenodd' };
    }

    return <path {...otherProps} d={move} style={pathStyle}/>;
  },

});

export default Path;
