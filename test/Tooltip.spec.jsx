import React, { addons } from 'react/addons';

import { renderEach } from './utils';
import Tooltip from '../src/components/tooltip/Tooltip';

describe('Tooltip', () => {

  let tooltip;
  renderEach(
    <Tooltip position={{ top: 0, left: 0 }} style={{ width: 50, height: 50 }} />,
    (component) => tooltip = component
  );

  it('should always be at least `margin`px from the top boundary of the page', () => {
    let rect;

    tooltip.setProps({ margin: 10, position: { top: 0, left: 500 } });
    rect = React.findDOMNode(tooltip).getBoundingClientRect();
    expect(rect.top).toBe(10);

    tooltip.setProps({ margin: 20, position: { top: 0, left: 500 } });
    rect = React.findDOMNode(tooltip).getBoundingClientRect();
    expect(rect.top).toBe(20);
  });

  it('should always be at least `margin`px from the left boundary of the page', () => {
    let rect;

    tooltip.setProps({ margin: 10, position: { top: 500, left: 0 } });
    rect = React.findDOMNode(tooltip).getBoundingClientRect();
    expect(rect.left).toBe(10);

    tooltip.setProps({ margin: 20, position: { top: 500, left: 0 } });
    rect = React.findDOMNode(tooltip).getBoundingClientRect();
    expect(rect.left).toBe(20);
  });

  it('should always be at least `margin`px from the right boundary of the page', () => {
    let rect;
    let documentWidth = document.body.offsetWidth;

    tooltip.setProps({ margin: 10, position: { top: 500, left: documentWidth } });
    rect = React.findDOMNode(tooltip).getBoundingClientRect();
    expect(rect.right).toBe(documentWidth - 10);

    tooltip.setProps({ margin: 20, position: { top: 500, left: documentWidth } });
    rect = React.findDOMNode(tooltip).getBoundingClientRect();
    expect(rect.right).toBe(documentWidth - 20);
  });

});
