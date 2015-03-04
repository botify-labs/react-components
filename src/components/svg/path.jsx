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

  componentDidMount() {
    if (this.props.inverse) {
      this._setFillRule();
    }
  },

  componentDidUpdate() {
    if (this.props.inverse) {
      this._setFillRule();
    }
  },

  _setFillRule() {
    this.getDOMNode().setAttribute('fill-rule', 'evenodd');
  },

  render() {
    let {d, inverse} = this.props;

    if (inverse) {
      d = fullShape + d;
    }

    return <path d={d} {..._.omit(this.props, 'd', 'inverse')}/>;
  }

});

export default Path;
