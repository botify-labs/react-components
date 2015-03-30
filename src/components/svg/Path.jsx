import React from 'react';
import _ from 'lodash';

const dim = 10000;
const fullShape = [
  `M ${-dim} ${-dim}`,
  `L ${dim} ${-dim}`,
  `L ${dim} ${dim}`,
  `L ${-dim} ${dim}`,
  `Z`
].join(' ');

const Path = React.createClass({

  render() {
    let { d, inverse, style = {}, ...otherProps } = this.props;

    if (inverse) {
      d = fullShape + d;
      style.fillRule = 'evenodd';
    }

    return <path {...otherProps} d={d} style={style}/>;
  }

});

export default Path;
