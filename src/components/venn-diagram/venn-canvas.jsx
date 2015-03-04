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

    // Re-scale the canvas whenever the window resizes
    window.addEventListener('resize', this._scale);
  },

  getInitialState() {
    return {
      width: 1000,
      height: 1000
    };
  },

  /**
   * Recalculate the venn diagram so that it fits into the canvas
   */
  _scale() {
    this.setState({
      width: this.getDOMNode().offsetWidth,
      height: this.getDOMNode().offsetHeight
    });
  },

  render() {
    let {vennData, inclusive, onMouseOver, onMouseOut} = this.props;
    let {width, height} = this.state;
    let padding = 10;

    let vennSets = vennData.getSets().toIndexedSeq();
    let vennIntersections = vennData.getIntersections();

    // Transform our data into a structure venn.js understands
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

    // Create circle intersections and circle differences to represent our sets and set intersections.
    // Since sets and set intersections are extremely similar, they share a lot of code.
    // TODO: this part doesn't support cases where we have more than two sets or/and the diagram is inclusive
    // In order to support those cases display-wise we'd probably need to switch to a vector library more
    // powerful than standard SVG 1.1. Vector boolean operations are really hard to do in SVG 1.1, whereas
    // PaperJS has them built in.
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
          onMouseOver={onMouseOver && onMouseOver.bind(null, el.set)}
          onMouseOut={onMouseOut && onMouseOver.bind(null, el.set)}
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
  }

});

export default VennCanvas;
