import React, { addons } from 'react/addons';
const { TestUtils } = addons;
import { Map, Set } from 'immutable';

import { render, unmount } from './utils';
import VennData from '../src/models/VennData';
import VennCanvas from '../src/components/venn-diagram/VennCanvas';
import { CircleDifference, CircleIntersection } from '../src/components/svg/Circle';

describe('VennCanvas', () => {
  let vennData = new VennData();

  var testSets = [];
  testSets.push(Map({
    size: 100,
    color: 'red',
    label: 'Set 1',
  }));
  testSets.push(Map({
    size: 200,
    color: 'blue',
    label: 'Set 2',
  }));
  testSets.forEach((set) => vennData.addSet(set));

  var testIntersections = [];
  testIntersections.push({
    sets: Set.of(testSets[0], testSets[1]),
    intersection: Map({
      size: 50,
      color: 'green',
      label: 'Intersection',
    })
  });
  testIntersections.forEach(({ sets, intersection }) => vennData.addIntersection(sets, intersection));

  it('should render a CircleDifference for each exclusive set and a CircleIntersection for each intersection', () => {
    let vennCanvas = render(<VennCanvas vennData={vennData} />);

    let circleDiffs = TestUtils.scryRenderedComponentsWithType(vennCanvas, CircleDifference);
    expect(circleDiffs.length).toBe(testSets.length);
    circleDiffs.forEach((circleDiff, idx) => {
      expect(circleDiff.props.fill).toBe(testSets[idx].get('color'));
    });

    let circleInters = TestUtils.scryRenderedComponentsWithType(vennCanvas, CircleIntersection);
    expect(circleInters.length).toBe(testIntersections.length);
    circleInters.forEach((circleInter, idx) => {
      expect(circleInter.props.fill).toBe(testIntersections[idx].intersection.get('color'));
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

    expect(spy.calls.length).toBe(testSets.length + testIntersections.length);
    testSets.forEach((set, idx) => expect(spy.calls[idx].arguments[0]).toBe(set));
    testIntersections.forEach((inter, idx) => expect(spy.calls[testSets.length + idx].arguments[0]).toBe(inter.intersection));

    unmount(vennCanvas);
  });

});
