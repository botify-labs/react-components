import React from 'react';
import venn from 'venn.js';

import Circle, {
  CircleDifference, CircleIntersection,
  CircleDifferenceInterior, CircleIntersectionInterior
} from '../svg/Circle';

const VennCanvas = React.createClass({

  displayName: 'VennCanvas',

  getInitialState() {
    return {
      width: 1000,
      height: 1000
    };
  },

  componentDidMount() {
    this._scale();

    // Re-scale the canvas whenever the window resizes
    window.addEventListener('resize', this._scale);
  },

  componentDidUpdate() {
    this._scale();
  },

  /**
   * Recalculate the venn diagram so that it fits into the canvas
   */
  _scale() {
    let {offsetWidth, offsetHeight} = this.getDOMNode();

    if (offsetWidth !== this.state.width || offsetHeight !== this.state.height) {
      this.setState({width: offsetWidth, height: offsetHeight});
    }
  },

  render() {
    let {vennData, inclusive, onClick, onMouseOver, onMouseOut} = this.props;
    let {width, height} = this.state;
    let padding = 30;

    let vennSets = vennData.getSets().toIndexedSeq();
    let vennIntersections = vennData.getIntersections();

    // Transform our data into a structure venn.js understands
    let sets = vennSets
      .map((set, idx) => {
        return {
          sets: [idx],
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


    let circles = venn.venn(sets.concat(intersections));
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
          style={onClick && {cursor: 'pointer'}}
          onClick={onClick && onClick.bind(null, el.set, idx)}
          onMouseOver={onMouseOver && onMouseOver.bind(null, el.set)}
          onMouseOut={onMouseOut && onMouseOut.bind(null, el.set)}
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