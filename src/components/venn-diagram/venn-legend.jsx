import React from 'react';

const VennLegend = React.createClass({

  displayName: 'VennLegend',

  render() {
    let {vennData, activeSet, inclusive} = this.props;

    let sets = vennData.getSets();
    let intersections = vennData.getIntersections().valueSeq();
    let elements = sets.concat(intersections).map((set, idx) => {
      return (
        <li
          key={idx}
          onMouseOver={this.props.onMouseOver && this.props.onMouseOver.bind(null, set)}
          onMouseOut={this.props.onMouseOut && this.props.onMouseOut.bind(null, set)}
        >
          <div
            className="VennLegend-square"
            style={{backgroundColor: set.get('color')}}
          />
          {set.get(inclusive ? 'inclusiveLabel' : 'exclusiveLabel')}
        </li>
      );
    }).toJS();

    return (
      <ul className="VennLegend">
        {elements}
      </ul>
    );
  }

});

export default VennLegend;
