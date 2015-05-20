import React, { addons } from 'react/addons';
const { TestUtils } = addons;

import { renderEach } from './utils';
import Positioned from '../src/components/misc/Positioned';
import FollowCursor from '../src/components/misc/FollowCursor';

describe('FollowCursor', () => {

  let followCursor;
  renderEach(
    <FollowCursor
      hasOverlay={false}
      renderOverlay={() => null}
    />,
    (component) => followCursor = component
  );

  it('should not render its Positioned when `hasOverlay` prop is false', () => {
    let content = TestUtils.scryRenderedComponentsWithType(followCursor, Positioned);
    expect(content.length).toBe(0);
  });

  it('should render its Positioned when `hasOverlay` prop is true', () => {
    followCursor.setProps({ hasOverlay: true });
    let content = TestUtils.scryRenderedComponentsWithType(followCursor, Positioned);
    expect(content.length).toBe(1);
  });

  it('should pass mouse position to the rendered Tooltip', () => {
    followCursor.setProps({ hasOverlay: true });
    TestUtils.Simulate.mouseMove(React.findDOMNode(followCursor), { pageX: 100, pageY: 100});
    let positioned = TestUtils.findRenderedComponentWithType(followCursor, Positioned);
    expect(positioned.props.position.top).toBe(100);
    expect(positioned.props.position.left).toBe(100);
  });

});
