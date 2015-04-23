import React, { PropTypes } from 'react';

import VennData from '../../models/VennData';

const VennLegend = React.createClass({

  displayName: 'VennLegend',

  propTypes: {
    vennData: PropTypes.instanceOf(VennData),
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
  },

  render() {
    let {vennData, onClick, onMouseOver, onMouseOut} = this.props;

    let sets = vennData.getSets();
    let intersections = vennData.getIntersections().map(([keySets, intersection]) => intersection);
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
  },

});

export default VennLegend;
