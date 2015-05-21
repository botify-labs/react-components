import React, { addons } from 'react/addons';
const { TestUtils } = addons;

import { render, unmount } from './utils';
import HorizontalGauge from '../src/components/gauges/HorizontalGauge';
import Positioned from '../src/components/misc/Positioned';

describe('HorizontalGauge', () => {

  let stacks = [
    {
      label: 'Stack 1',
      color: 'red',
      value: 25,
    },
    {
      label: 'Stack 2',
      color: 'red',
      value: 50,
    },
  ];
  let all = {
    label: 'All',
    color: 'blue',
    value: 100,
  };

  it('should render a tooltip on hover', () => {
    let gauge = render(<HorizontalGauge stacks={stacks} all={all} />);
    let gaugeNode = React.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(gauge, 'HorizontalGauge'));
    let tooltips;
    // TestUtils.Simulate.{mouseEnter, mouseLeave} don't work (yet)
    // See https://github.com/facebook/react/issues/1297
    TestUtils.SimulateNative.mouseOver(gaugeNode);
    tooltips = TestUtils.scryRenderedComponentsWithType(gauge, Positioned);
    expect(tooltips.length).toBe(1);
    TestUtils.SimulateNative.mouseOut(gaugeNode);
    tooltips = TestUtils.scryRenderedComponentsWithType(gauge, Positioned);
    expect(tooltips.length).toBe(0);
    unmount(gauge);
  });

  it('should pass stacks `value` properties through the `formatStackValue` prop before rendering them', () => {
    let gauge = render(
      <HorizontalGauge
        stacks={stacks}
        all={all}
        formatStackValue={v => <div className="formatted">{v.toFixed(2)}</div>}
        />
    );
    let gaugeNode = React.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(gauge, 'HorizontalGauge'));
    TestUtils.SimulateNative.mouseOver(gaugeNode);
    let formatted = TestUtils.scryRenderedDOMComponentsWithClass(gauge, 'formatted');
    expect(formatted.length).toBe(2);
    let formattedNode1 = React.findDOMNode(formatted[0]);
    expect(formattedNode1.innerText).toBe('25.00');
    let formattedNode2 = React.findDOMNode(formatted[1]);
    expect(formattedNode2.innerText).toBe('50.00');
    unmount(gauge);
  });


  it('should pass the all stack\'s `value` property through the `formatAllValue` prop before rendering it', () => {
    let gauge = render(
      <HorizontalGauge
        stacks={stacks}
        all={all}
        formatAllValue={v => <div className="formatted">{v.toFixed(2)}</div>}
        />
    );
    let gaugeNode = React.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(gauge, 'HorizontalGauge'));
    TestUtils.SimulateNative.mouseOver(gaugeNode);
    let formatted = TestUtils.scryRenderedDOMComponentsWithClass(gauge, 'formatted');
    expect(formatted.length).toBe(1);
    let formattedNode = React.findDOMNode(formatted[0]);
    expect(formattedNode.innerText).toBe('100.00');
    unmount(gauge);
  });

  it('should render stacks with a width relative their values and with the provided color', () => {
    let gauge = render(<HorizontalGauge stacks={stacks} all={all} />);
    let allNode = React.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(gauge, 'HorizontalGauge-all'));
    expect(allNode.style.backgroundColor).toBe(all.color);
    let stacksComponents = TestUtils.scryRenderedDOMComponentsWithClass(gauge, 'HorizontalGauge-stack');
    expect(stacksComponents.length).toBe(stacks.length);
    stacks.forEach((stack, idx) => {
      let node = React.findDOMNode(stacksComponents[idx]);
      expect(node.style.backgroundColor).toBe(stack.color);
      let observedWidth = Math.round(node.offsetWidth);
      let expectedWidth = Math.round(stack.value / all.value * allNode.offsetWidth);
      expect(observedWidth).toBe(expectedWidth);
    });
    unmount(gauge);
  });

});
