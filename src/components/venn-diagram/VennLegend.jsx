import React from 'react';

const VennLegend = React.createClass({

  displayName: 'VennLegend',

  render() {
    let {vennData, activeSet, onClick, onMouseOver, onMouseOut} = this.props;

    let sets = vennData.getSets();
    let intersections = vennData.getIntersections().valueSeq();
    let elements = sets.concat(intersections).map((set, idx) => {
      return (
        <li
          key={idx}
          style={onClick && {cursor: 'pointer'}}
          onClick={onClick && onClick.bind(null, set, idx)}
          onMouseOver={onMouseOver && onMouseOver.bind(null, set)}
          onMouseOut={onMouseOut && onMouseOut.bind(null, set)}
        >
          <div
            className="VennLegend-square"
            style={{backgroundColor: set.get('color')}}
          />
          {set.get('label')}
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