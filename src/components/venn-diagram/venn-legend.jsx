import React from 'react';

const VennLegend = React.createClass({

  displayName: 'VennLegend',

  propTypes: {
    sets: React.PropTypes.array,
    intersections: React.PropTypes.array,
    exclusives: React.PropTypes.array,
    activeElement: React.PropTypes.object,
    onMouseOver: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
  },

  render() {
    let exclusives = this.props.exclusives.map((set, idx) => {
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

    let intersections = this.props.intersections.map((intersection, idx) => {
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
        {exclusives}
        {intersections}
      </ul>
    );
  }

});

export default VennLegend;
