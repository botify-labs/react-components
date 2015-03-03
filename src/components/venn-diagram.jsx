import React from 'react';
import Immutable from 'immutable';
import _ from 'lodash';
import Color from 'color';

// venn sets itself on the window object and expects d3 to be globally set as well
// below is a shim that fixes this
import venn from 'imports?window=>{}!exports?window.venn!venn';

import HoverTooltip from './tooltip/hover-tooltip';

import './venn-diagram.scss';

function getFullShape(dim = 10000) {
  var halfDim = dim / 2;
  return [
    `M ${-halfDim} ${-halfDim}`,
    `L ${halfDim} ${-halfDim}`,
    `L ${halfDim} ${halfDim}`,
    `L ${-halfDim} ${halfDim}`,
    `Z`
  ].join(' ');
}

function getCircleShape(x, y, radius) {
  return [
    `M ${x} ${y}`,
    `m ${-radius}, 0`,
    `a ${radius},${radius} 0 1,0 ${radius * 2},0`,
    `a ${radius},${radius} 0 1,0 ${-radius * 2},0`,
    `Z`
  ].join(' ');
}

var UniqueIdMixin = {

  componentWillMount() {
    this._id = _.uniqueId();
  },

  _getId(id) {
    return `${this._id}.${id}`;
  }

};

var Path = React.createClass({

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
    var {d, inverse} = this.props;

    if (inverse) {
      d = getFullShape() + d;
    }

    return <path d={d} {..._.omit(this.props, 'd', 'inverse')}/>;
  }

});

var Circle = React.createClass({

  render() {
    var {x, y, radius} = this.props;

    return (
      <Path d={getCircleShape(x, y, radius)} {..._.omit(this.props, 'x', 'y', 'radius')}/>
    );
  }

});


var Mask = React.createClass({

  mixins: [UniqueIdMixin],

  componentDidMount() {
    this._setMask();
  },

  componentDidUpdate() {
    this._setMask();
  },

  _setMask() {
    this.refs.group.getDOMNode().setAttribute('mask', `url(#${this._getId('mask')})`)
  },

  render() {
    return (
      <g>
        <mask id={this._getId('mask')}>
          {this.props.mask}
        </mask>
        <g ref="group" {..._.omit(this.props, 'children', 'mask')}>
          {this.props.children}
        </g>
      </g>
    );
  }

});

var ClipPath = React.createClass({

  mixins: [UniqueIdMixin],

  componentDidMount() {
    this._setClipPath();
  },

  componentDidUpdate() {
    this._setClipPath();
  },

  _setClipPath() {
    this.refs.group.getDOMNode().setAttribute('clip-path', `url(#${this._getId('clipPath')})`)
  },

  render() {
    return (
      <g>
        <clipPath id={this._getId('clipPath')}>
          {this.props.path}
        </clipPath>
        <g ref="group" {..._.omit(this.props, 'children', 'path')}>
          {this.props.children}
        </g>
      </g>
    );
  }

});

var CircleIntersection = React.createClass({

  render() {
    var {c1, c2, fill, inverse} = this.props;

    var clipPath = <Circle {...c2} />;

    return (
      <ClipPath path={clipPath} {..._.omit(this.props, 'fill', 'c1', 'c2')}>
        <Circle fill={fill} {...c1} />
      </ClipPath>
    );
  }

});

var CircleDifference = React.createClass({

  render() {
    var {c1, c2, fill} = this.props;

    var clipPath = <Circle inverse={true} {...c2} />;

    return (
      <ClipPath path={clipPath} {..._.omit(this.props, 'fill', 'c1', 'c2')}>
        <Circle fill={fill} {...c1} />
      </ClipPath>
    );
  }

});

var CircleIntersectionStroke = React.createClass({

  render() {
    var {c1, c2, width, fill} = this.props;

    var mask = (
      <g>
        <CircleIntersection
          c1={c1}
          c2={c2}
          fill="white"
        />
        <CircleIntersection
          c1={_.assign({}, c1, {
            radius: c1.radius - width
          })}
          c2={_.assign({}, c2, {
            radius: c2.radius - width
          })}
          fill="black"
        />
      </g>
    );

    return (
      <Mask style={{pointerEvents: 'none'}} mask={mask} {..._.omit(this.props, 'fill', 'c1', 'c2')}>
        <rect width="100%" height="100%" fill={fill} />
      </Mask>
    );
  }

});

var CircleDifferenceStroke = React.createClass({

  render() {
    var {c1, c2, width, fill} = this.props;

    var mask = (
      <g>
        <CircleDifference
          c1={c1}
          c2={c2}
          fill="white"
        />
        <CircleDifference
          c1={_.assign({}, c1, {
            radius: c1.radius - width
          })}
          c2={_.assign({}, c2, {
            radius: c2.radius + width
          })}
          fill="black"
        />
      </g>
    );

    return (
      <Mask style={{pointerEvents: 'none'}} mask={mask} {..._.omit(this.props, 'fill', 'c1', 'c2')}>
        <rect width="100%" height="100%" fill={fill} />
      </Mask>
    );
  }

});

var VennLegend = React.createClass({

  render() {
    var sets = this.props.sets.map((set, idx) => {
      return (
        <li
          key={`set${idx}`}
          onMouseOver={this.props.onMouseOver && this.props.onMouseOver.bind(null, set)}
          onMouseOut={this.props.onMouseOut && this.props.onMouseOut.bind(null, set)}
        >
          <div
            className="VennLegend-square"
            style={{backgroundColor: set.metadata.color}}
          />
          {set.metadata.label}
        </li>
      );
    });

    var intersections = this.props.intersections.map((intersection, idx) => {
      return (
        <li
          key={`intersection${idx}`}
          onMouseOver={this.props.onMouseOver && this.props.onMouseOver.bind(null, intersection)}
          onMouseOut={this.props.onMouseOut && this.props.onMouseOut.bind(null, intersection)}
        >
          <div
            className="VennLegend-square"
            style={{backgroundColor: intersection.metadata.color}}
          />
          {intersection.metadata.label}
        </li>
      );
    });

    return (
      <ul className="VennLegend">
        {sets}
        {intersections}
      </ul>
    );
  }

});

var VennCanvas = React.createClass({

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
    var padding = 10;

    // get positions for each set
    var circles = venn.venn(this.props.sets, this.props.intersections);
    circles = venn.scaleSolution(circles, this.state.width, this.state.height, padding);

    var intersectionStroke, differenceStroke;

    var circleElements = circles.map((set, idx) => {
      if (set === this.props.activeElement) {
        differenceStroke = (
          <CircleDifferenceStroke
            c1={set}
            c2={circles[1 - idx]}
            fill={Color(set.metadata.color).darken(0.2).rgbString()}
            width={4}
          />
        );
      }

      return (
        <CircleDifference
          key={`circle${idx}`}
          onMouseOver={this._handleMouseOver.bind(null, set)}
          onMouseOut={this._handleMouseOut.bind(null, set)}
          c1={set}
          c2={circles[1 - idx]}
          fill={set.metadata.color}
        />
      );
    });

    var intersectionElements = this.props.intersections.map((intersection, idx) => {
      var sets = intersection.sets;
      var [c1, c2] = [circles[sets[0]], circles[sets[1]]];

      if (intersection === this.props.activeElement) {
        intersectionStroke = (
          <CircleIntersectionStroke
            c1={c1}
            c2={c2}
            fill={Color(intersection.metadata.color).darken(0.2).rgbString()}
            width={4}
          />
        );
      }

      return (
        <CircleIntersection
          key={`intersection${idx}`}
          onMouseOver={this._handleMouseOver.bind(null, intersection)}
          onMouseOut={this._handleMouseOut.bind(null, intersection)}
          c1={c1}
          c2={c2}
          fill={intersection.metadata.color}
        />
      );
    });

    return (
      <svg
        className="VennCanvas"
        width={this.props.width}
        height={this.props.height}
      >
        {circleElements}
        {intersectionElements}
        {intersectionStroke}
        {differenceStroke}
      </svg>
    );
  },

  _handleMouseOver(thing) {
    if (this.props.onMouseOver) {
      this.props.onMouseOver(thing);
    }
  },

  _handleMouseOut(thing) {
    if (this.props.onMouseOut) {
      this.props.onMouseOut(thing);
    }
  }

})

/**
 * Wrapper around the venn d3 library
 */
var VennDiagram = React.createClass({

  displayName: 'VennDiagram',

  getInitialState() {
    return {
      activeElement: null,
      width: null
    };
  },

  render() {
    return (
      <HoverTooltip
        hasTooltip={!!this.state.activeElement}
        renderTooltip={this._renderTooltip}
      >
        <div className="VennChart" style={{height: 500}}>
          <VennCanvas
            ref="canvas"
            sets={this.props.sets}
            intersections={this.props.intersections}
            activeElement={this.state.activeElement}
            onMouseOver={this._handleMouseOver}
            onMouseOut={this._handleMouseOut}
          />
          <VennLegend
            sets={this.props.sets}
            intersections={this.props.intersections}
            onMouseOver={this._handleMouseOver}
            onMouseOut={this._handleMouseOut}
          />
        </div>
      </HoverTooltip>
    );
  },

  _handleMouseOver(thing) {
    this.setState({activeElement: thing});
  },

  _handleMouseOut(thing) {
    this.setState({activeElement: null});
  },

  _renderTooltip() {
    return (
      <div>
        <div>{this.state.activeElement.metadata.label}</div>
        <div>Size: {this.state.activeElement.size}</div>
      </div>
    );
  },

});

export default VennDiagram;