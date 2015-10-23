import React from 'react';
import _ from 'lodash';
import Path from './Path';
import Mask from './Mask';
import ClipPath from './ClipPath';

const Circle = React.createClass({

  displayName: 'Circle',

  propTypes: {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    radius: React.PropTypes.number.isRequired,
  },

  _getCircleShape() {
    let {x, y, radius} = this.props;

    // `\,` are a @WORKAROUND: See https://github.com/babel/babel-eslint/issues/31
    return [
      `M ${x} ${y}`,
      `m ${-radius}\, 0`,
      `a ${radius}\,${radius} 0 1,0 ${radius * 2}\,0`,
      `a ${radius}\,${radius} 0 1,0 ${-radius * 2}\,0`,
      `Z`,
    ].join(' ');
  },

  render() {
    return (
      <Path d={this._getCircleShape()} {..._.omit(this.props, 'x', 'y', 'radius')}/>
    );
  },

});

const CircleIntersection = React.createClass({

  displayName: 'CircleIntersection',

  propTypes: {
    c1: React.PropTypes.object.isRequired,
    c2: React.PropTypes.object.isRequired,
    fill: React.PropTypes.string,
  },

  render() {
    let {c1, c2, fill} = this.props;

    let clipPath = <Circle {...c2} />;

    return (
      <ClipPath path={clipPath} {..._.omit(this.props, 'fill', 'c1', 'c2')}>
        <Circle fill={fill} {...c1} />
      </ClipPath>
    );
  },

});

const CircleDifference = React.createClass({

  displayName: 'CircleDifference',

  propTypes: {
    c1: React.PropTypes.object.isRequired,
    c2: React.PropTypes.object.isRequired,
    fill: React.PropTypes.string,
  },

  render() {
    let {c1, c2, fill} = this.props;

    let clipPath = <Circle inverse={true} {...c2} />;

    return (
      <ClipPath path={clipPath} {..._.omit(this.props, 'fill', 'c1', 'c2')}>
        <Circle fill={fill} {...c1} />
      </ClipPath>
    );
  },

});

const CircleIntersectionStroke = React.createClass({

  displayName: 'CircleIntersectionStroke',

  propTypes: {
    c1: React.PropTypes.object.isRequired,
    c2: React.PropTypes.object.isRequired,
    width: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string,
  },

  render() {
    let {c1, c2, width, fill} = this.props;

    let mask = (
      <g>
        <CircleIntersection
          c1={c1}
          c2={c2}
          fill="white"
        />
        <CircleIntersection
          c1={_.assign({}, c1, {
            radius: c1.radius - width,
          })}
          c2={_.assign({}, c2, {
            radius: c2.radius - width,
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
  },

});

const CircleDifferenceStroke = React.createClass({

  displayName: 'CircleDifferenceStroke',

  propTypes: {
    c1: React.PropTypes.object.isRequired,
    c2: React.PropTypes.object.isRequired,
    width: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string,
  },

  render() {
    let {c1, c2, width, fill} = this.props;

    let mask = (
      <g>
        <CircleDifference
          c1={c1}
          c2={c2}
          fill="white"
        />
        <CircleDifference
          c1={_.assign({}, c1, {
            radius: c1.radius - width,
          })}
          c2={_.assign({}, c2, {
            radius: c2.radius + width,
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
  },

});

const CircleDifferenceInterior = React.createClass({

  displayName: 'CircleDifferenceInterior',

  propTypes: {
    c1: React.PropTypes.object.isRequired,
    c2: React.PropTypes.object.isRequired,
    width: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string,
  },

  render() {
    let {c1, c2, width, fill} = this.props;

    return (
      <CircleDifference
        c1={_.assign({}, c1, {
          radius: c1.radius - width,
        })}
        c2={_.assign({}, c2, {
          radius: c2.radius + width,
        })}
        fill={fill}
        style={{pointerEvents: 'none'}}
        {..._.omit(this.props, 'fill', 'width', 'c1', 'c2')}
      />
    );
  },

});

const CircleIntersectionInterior = React.createClass({

  displayName: 'CircleIntersectionInterior',

  propTypes: {
    c1: React.PropTypes.object.isRequired,
    c2: React.PropTypes.object.isRequired,
    width: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string,
  },

  render() {
    let {c1, c2, width, fill} = this.props;

    return (
      <CircleIntersection
        c1={_.assign({}, c1, {
          radius: c1.radius - width,
        })}
        c2={_.assign({}, c2, {
          radius: c2.radius - width,
        })}
        fill={fill}
        style={{pointerEvents: 'none'}}
        {..._.omit(this.props, 'fill', 'width', 'c1', 'c2')}
      />
    );
  },

});

// @WORKAROUND: See https://github.com/babel/babel-eslint/issues/8
_.assign(Circle, {
  CircleIntersection, CircleDifference,
  CircleIntersectionStroke, CircleDifferenceStroke,
  CircleIntersectionInterior, CircleDifferenceInterior,
});
export default Circle;
