import React from 'react/addons';

export function renderEach(element, callback) {
  let component;
  beforeEach(() => {
    callback(component = render(element));
  });

  afterEach(() => {
    unmount(component);
  });
}

export function render(element) {
  let node = document.createElement('div');
  document.body.appendChild(node);
  return React.render(element, node);
}

export function unmount(component) {
  let node = React.findDOMNode(component).parentNode;
  React.unmountComponentAtNode(node);
  document.body.removeChild(node);
}
