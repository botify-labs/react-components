import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { render } from './utils';
import Positioned from '../src/components/misc/Positioned';
import FollowCursor from '../src/components/misc/FollowCursor';

describe('FollowCursor', () => {
  it('should not render its Positioned when `hasOverlay` prop is false', () => {
    const followCursor = render(
      <FollowCursor
        hasOverlay={false}
        renderOverlay={() => null}
      />
    );
    let content = TestUtils.scryRenderedComponentsWithType(followCursor, Positioned);
    expect(content.length).toBe(0);
  });

  it('should render its Positioned when `hasOverlay` prop is true', () => {
    const followCursor = render(
      <FollowCursor
        hasOverlay={true}
        renderOverlay={() => null}
      />
    );
    let content = TestUtils.scryRenderedComponentsWithType(followCursor, Positioned);
    expect(content.length).toBe(1);
  });

  it('should pass mouse position to the rendered Tooltip', () => {
    const followCursor = render(
      <FollowCursor
        hasOverlay={true}
        renderOverlay={() => null}
      />
    );
    TestUtils.Simulate.mouseMove(ReactDOM.findDOMNode(followCursor), { pageX: 100, pageY: 100});
    let positioned = TestUtils.findRenderedComponentWithType(followCursor, Positioned);
    expect(positioned.props.position.top).toBe(100);
    expect(positioned.props.position.left).toBe(100);
  });
});
