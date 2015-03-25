import React, { addons } from 'react/addons';
const { TestUtils } = addons;

import Tooltip from '../src/components/tooltip/Tooltip';
import HoverTooltip from '../src/components/tooltip/HoverTooltip';

describe('HoverTooltip', () => {

  let hoverTooltip;
  beforeEach(() => {
    hoverTooltip = TestUtils.renderIntoDocument(
      <HoverTooltip
        hasTooltip={false}
        renderTooltip={() => null}
      />
    );
  })

  it('should not render its tooltip when `hasTooltip` prop is false', () => {
    let content = TestUtils.scryRenderedComponentsWithType(hoverTooltip, Tooltip);
    expect(content.length).toBe(0);
  });

  it('should render its tooltip when `hasTooltip` prop is true', () => {
    hoverTooltip.setProps({ hasTooltip: true });
    let content = TestUtils.scryRenderedComponentsWithType(hoverTooltip, Tooltip);
    expect(content.length).toBe(1);
  });

  it('should pass mouse position to the rendered Tooltip', () => {
    hoverTooltip.setProps({ hasTooltip: true });
    TestUtils.Simulate.mouseMove(React.findDOMNode(hoverTooltip), { pageX: 100, pageY: 100});
    let tooltip = TestUtils.findRenderedComponentWithType(hoverTooltip, Tooltip);
    expect(tooltip.props.position.top).toBe(100);
    expect(tooltip.props.position.left).toBe(100);
  });

});
