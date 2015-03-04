import React from 'react';
// venn sets itself on the window object and expects d3 to be globally set as well
// below is a shim that fixes this
import venn from 'imports?window=>{}!exports?window.venn!venn';

import Circle, {
  CircleDifference, CircleIntersection,
  CircleDifferenceInterior, CircleIntersectionInterior
} from '../svg/circle';

const VennCanvas = React.createClass({

  displayName: 'VennCanvas',

  componentDidMount() {
    this._scale();

    window.addEventListener('resize', this._scale);
  },

  getInitialState() {
    return {
      width: 1000,
      height: 1000
    };
  },

  _scale() {
    this.setState({
      width: this.getDOMNode().offsetWidth,
      height: this.getDOMNode().offsetHeight
    });
  },

  render() {
    let {vennData, inclusive} = this.props;
    let {width, height} = this.state;
    let padding = 10;

    let vennSets = vennData.getSets().toIndexedSeq();
    let vennIntersections = vennData.getIntersections();

    let sets = vennSets
      .map((set) => {
        return {
          size: set.get('size')
        };
      })
      .toJS();
    let intersections = vennIntersections
      .entrySeq()
      .map(([sets, intersection]) => {
        return {
          sets: sets.map((set) => vennSets.indexOf(set)).toJS(),
          size: intersection.get('size')
        };
      })
      .toJS();

    let circles = venn.venn(sets, intersections);
    circles = venn.scaleSolution(circles, width, height, padding);

    // TODO: this part doesn't support sets.length > 2 || intersections.length > 1 || inclusive
    let setElements = vennSets.map((set, idx) => {
      return {
        set: set,
        c1: circles[idx],
        c2: circles[1 - idx],
        class: CircleDifference
      };
    });
    let interElements = vennIntersections.entrySeq().map(([sets, intersection]) => {
      return {
        set: intersection,
        c1: circles[vennSets.indexOf(sets.first())],
        c2: circles[vennSets.indexOf(sets.last())],
        class: CircleIntersection
      };
    });
    let elements = setElements.concat(interElements).map((el, idx) => {
      return (
        <el.class
          key={idx}
          onMouseOver={this._handleMouseOver.bind(null, el.set)}
          onMouseOut={this._handleMouseOut.bind(null, el.set)}
          c1={el.c1}
          c2={el.c2}
          fill={el.set.get('color')}
          opacity={el.set === this.props.activeSet ? 1 : 0.8}
        />
      );
    }).toJS();

    return (
      <svg className="VennCanvas">
        {elements}
      </svg>
    );
  },

  _handleMouseOver(set) {
    if (this.props.onMouseOver) {
      this.props.onMouseOver(set);
    }
  },

  _handleMouseOut(set) {
    if (this.props.onMouseOut) {
      this.props.onMouseOut(set);
    }
  }

});

export default VennCanvas;
