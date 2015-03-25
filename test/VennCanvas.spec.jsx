import React, { addons } from 'react/addons';
const { TestUtils } = addons;
import { Map, Set } from 'immutable';

import { render, unmount } from './utils';
import VennData from '../src/models/VennData';
import VennCanvas from '../src/components/venn-diagram/VennCanvas';
import { CircleDifference, CircleIntersection } from '../src/components/svg/Circle';
import ClipPath from '../src/components/svg/ClipPath';

describe('VennCanvas', () => {
  let vennData = new VennData();

  var sets = [];
  sets.push(Map({
    size: 100,
    color: 'red',
    label: 'Set 1',
  }));
  sets.push(Map({
    size: 200,
    color: 'blue',
    label: 'Set 2',
  }))
  sets.forEach((set) => vennData.addSet(set));

  var inters = [];
  inters.push({
    sets: Set.of(sets[0], sets[1]),
    intersection: Map({
      size: 50,
      color: 'green',
      label: 'Intersection',
    })
  });
  inters.forEach(({ sets, intersection }) => vennData.addIntersection(sets, intersection));

  it('should render a CircleDifference for each exclusive set and a CircleIntersection for each intersection', () => {
    let vennCanvas = render(<VennCanvas vennData={vennData} />);

    let circleDiffs = TestUtils.scryRenderedComponentsWithType(vennCanvas, CircleDifference);
    circleDiffs.forEach((circleDiff, idx) => {
      expect(circleDiff.props.fill).toBe(sets[idx].get('color'));
    });

    let circleInters = TestUtils.scryRenderedComponentsWithType(vennCanvas, CircleIntersection);
    circleInters.forEach((circleInter, idx) => {
      expect(circleInter.props.fill).toBe(inters[idx].intersection.get('color'));
    });

    unmount(vennCanvas);
  });

  it('should call its `onClick` handler prop when a set is clicked on', () => {
    let props = {
      vennData,
      onClick(set, idx) { }
    };
    let spy = expect.spyOn(props, 'onClick');
    let vennCanvas = render(<VennCanvas {...props} />);

    // Find React base DOM components (div, span, etc.) which have been assigned a onClick handler,
    // and simulate a click on them.
    TestUtils.findAllInRenderedTree(vennCanvas, (component) => {
      return (TestUtils.isDOMComponent(component) && component.props.onClick);
    }).forEach((component) => TestUtils.Simulate.click(component));

    expect(spy.calls.length).toBe(sets.length + inters.length);
    sets.forEach((set, idx) => expect(spy.calls[idx].arguments[0]).toBe(set));
    inters.forEach((inter, idx) => expect(spy.calls[sets.length + idx].arguments[0]).toBe(inter.intersection));

    unmount(vennCanvas);
  });

});
