import React from 'react';
import ReactDOM from 'react-dom';

import { render } from './utils';
import Positioned from '../src/components/misc/Positioned';

describe('Positioned', () => {
  it('should always be at least `margin`px from the top boundary of the page', () => {
    let rect;
    let positioned = render(
      <Positioned
        margin={10}
        position={{ top: 0, left: 500 }}
        style={{ width: 50, height: 50 }}
      />
    );
    rect = ReactDOM.findDOMNode(positioned).getBoundingClientRect();
    expect(rect.top).toBe(10);

    positioned = render(
      <Positioned
        margin={20}
        position={{ top: 0, left: 500 }}
        style={{ width: 50, height: 50 }}
      />
    );
    rect = ReactDOM.findDOMNode(positioned).getBoundingClientRect();
    expect(rect.top).toBe(20);
  });

  it('should always be at least `margin`px from the left boundary of the page', () => {
    let rect;
    let positioned = render(
      <Positioned
        margin={10}
        position={{ top: 500, left: 0 }}
        style={{ width: 50, height: 50 }}
      />
    );
    rect = ReactDOM.findDOMNode(positioned).getBoundingClientRect();
    expect(rect.left).toBe(10);

    positioned = render(
      <Positioned
        margin={20}
        position={{ top: 500, left: 0 }}
        style={{ width: 50, height: 50 }}
      />
    );
    rect = ReactDOM.findDOMNode(positioned).getBoundingClientRect();
    expect(rect.left).toBe(20);
  });

  it('should always be at least `margin`px from the right boundary of the page', () => {
    let rect;
    let documentWidth = document.body.offsetWidth;

    let positioned = render(
      <Positioned
        margin={10}
        position={{ top: 500, left: documentWidth }}
        style={{ width: 50, height: 50 }}
      />
    );
    rect = ReactDOM.findDOMNode(positioned).getBoundingClientRect();
    expect(rect.right).toBe(documentWidth - 10);

    positioned = render(
      <Positioned
        margin={20}
        position={{ top: 500, left: documentWidth }}
        style={{ width: 50, height: 50 }}
      />
    );
    rect = ReactDOM.findDOMNode(positioned).getBoundingClientRect();
    expect(rect.right).toBe(documentWidth - 20);
  });
});
