import React, { addons } from 'react/addons';
const { TestUtils } = addons;

import { render, unmount } from './utils';
import HorizontalGauge from '../src/components/gauges/HorizontalGauge';
import Tooltip from '../src/components/tooltip/Tooltip';

describe('HorizontalGauge', () => {

  let stacks = [
    {
      label: 'Stack 1',
      color: 'red',
      value: 25
    },
    {
      label: 'Stack 2',
      color: 'red',
      value: 25
    }
  ];
  let all = {
    label: 'All',
    color: 'blue',
    value: 100
  };

  it('should render a tooltip on hover', () => {
    let gauge = render(<HorizontalGauge stacks={stacks} all={all} />);
    let gaugeNode = React.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(gauge, 'HorizontalGauge'));
    let tooltips;
    // TestUtils.Simulate.{mouseEnter, mouseLeave} don't work (yet)
    // See https://github.com/facebook/react/issues/1297
    TestUtils.SimulateNative.mouseOver(gaugeNode);
    tooltips = TestUtils.scryRenderedComponentsWithType(gauge, Tooltip);
    expect(tooltips.length).toBe(1);
    TestUtils.SimulateNative.mouseOut(gaugeNode);
    tooltips = TestUtils.scryRenderedComponentsWithType(gauge, Tooltip);
    expect(tooltips.length).toBe(0);
    unmount(gauge);
  });

  it('should render stacks with a width relative their values and with the provided color', () => {
    let gauge = render(<HorizontalGauge stacks={stacks} all={all} />);
    let gaugeNode = React.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(gauge, 'HorizontalGauge'));
    expect(gaugeNode.style.backgroundColor).toBe(all.color);
    let stacksComponents = TestUtils.scryRenderedDOMComponentsWithClass(gauge, 'HorizontalGauge-stack');
    expect(stacksComponents.length).toBe(stacks.length);
    stacks.forEach((stack, idx) => {
      let node = React.findDOMNode(stacksComponents[idx]);
      expect(node.style.backgroundColor).toBe(stack.color);
      let observedWidth = Math.round(node.offsetWidth);
      let expectedWidth = Math.round(stack.value / all.value * gaugeNode.offsetWidth);
      expect(observedWidth).toBe(expectedWidth);
    });
    unmount(gauge);
  })

});
