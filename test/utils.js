import React from 'react/addons';

export function renderEach(element, callback) {
  let component, node;
  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node);
    component = React.render(element, node);
    callback(component);
  });

  afterEach(() => {
    document.body.removeChild(node);
  });
};

