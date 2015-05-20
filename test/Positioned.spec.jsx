import React from 'react';

import { renderEach } from './utils';
import Positioned from '../src/components/misc/Positioned';

describe('Positioned', () => {

  let positioned;
  renderEach(
    <Positioned position={{ top: 0, left: 0 }} style={{ width: 50, height: 50 }} />,
    (component) => positioned = component
  );

  it('should always be at least `margin`px from the top boundary of the page', () => {
    let rect;

    positioned.setProps({ margin: 10, position: { top: 0, left: 500 } });
    rect = React.findDOMNode(positioned).getBoundingClientRect();
    expect(rect.top).toBe(10);

    positioned.setProps({ margin: 20, position: { top: 0, left: 500 } });
    rect = React.findDOMNode(positioned).getBoundingClientRect();
    expect(rect.top).toBe(20);
  });

  it('should always be at least `margin`px from the left boundary of the page', () => {
    let rect;

    positioned.setProps({ margin: 10, position: { top: 500, left: 0 } });
    rect = React.findDOMNode(positioned).getBoundingClientRect();
    expect(rect.left).toBe(10);

    positioned.setProps({ margin: 20, position: { top: 500, left: 0 } });
    rect = React.findDOMNode(positioned).getBoundingClientRect();
    expect(rect.left).toBe(20);
  });

  it('should always be at least `margin`px from the right boundary of the page', () => {
    let rect;
    let documentWidth = document.body.offsetWidth;

    positioned.setProps({ margin: 10, position: { top: 500, left: documentWidth } });
    rect = React.findDOMNode(positioned).getBoundingClientRect();
    expect(rect.right).toBe(documentWidth - 10);

    positioned.setProps({ margin: 20, position: { top: 500, left: documentWidth } });
    rect = React.findDOMNode(positioned).getBoundingClientRect();
    expect(rect.right).toBe(documentWidth - 20);
  });

});
