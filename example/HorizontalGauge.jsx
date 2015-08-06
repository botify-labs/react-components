import React from 'react';
import HorizontalGauge from 'components/gauges/HorizontalGauge';

import './HorizontalGauge.scss';


const exampleGauge = (
  <HorizontalGauge
    all={{ value: 5 }}
    stacks={[{ value: 2, label: 'R', color: 'red' }]}
  />
);

React.render(exampleGauge, document.getElementById('container'));
