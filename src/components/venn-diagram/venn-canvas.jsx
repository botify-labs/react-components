import React from 'react';
// venn sets itself on the window object and expects d3 to be globally set as well
// below is a shim that fixes this
import venn from 'imports?window=>{}!exports?window.venn!venn';
import Color from 'color';

import Circle, {
  CircleDifference, CircleIntersection,
  CircleDifferenceInterior, CircleIntersectionInterior
} from '../svg/circle';

const VennCanvas = React.createClass({

  displayName: 'VennCanvas',

  propTypes: {
    sets: React.PropTypes.array,
    intersections: React.PropTypes.array,
    exclusives: React.PropTypes.array,
    activeElement: React.PropTypes.object,
    onMouseOver: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
  },

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
    let padding = 10;

    // get positions for each set
    let circles = venn.venn(this.props.sets, this.props.intersections);
    circles = venn.scaleSolution(circles, this.state.width, this.state.height, padding);

    let diffElements = this.props.exclusives.map((set, idx) => {
      return {
        set: set,
        c1: circles[idx],
        c2: circles[1 - idx],
        class: CircleDifference
      };
    });
    let interElements = this.props.intersections.map((set) => {
      return {
        set: set,
        c1: circles[set.sets[0]],
        c2: circles[set.sets[1]],
        class: CircleIntersection
      };
    });
    let elements = diffElements.concat(interElements).map((el, idx) => {
      let color = Color(el.set.metadata.color);

      return (
        <el.class
          key={idx}
          onMouseOver={this._handleMouseOver.bind(null, el)}
          onMouseOut={this._handleMouseOut.bind(null, el)}
          c1={el.c1}
          c2={el.c2}
          fill={
            el.set === this.props.activeElement ?
              color.clone().lightness(color.lightness() + 10).rgbString() :
              color.rgbString()
          }
        />
      );
    });

    return (
      <svg className="VennCanvas">
        {elements}
      </svg>
    );
  },

  _handleMouseOver(el) {
    if (this.props.onMouseOver) {
      this.props.onMouseOver(el.set);
    }
  },

  _handleMouseOut(el) {
    if (this.props.onMouseOut) {
      this.props.onMouseOut(el.set);
    }
  }

});

export default VennCanvas;
