import ReactDOM from 'react-dom';


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
  return ReactDOM.render(element, node);
}

export function unmount(component) {
  let node = ReactDOM.findDOMNode(component).parentNode;
  ReactDOM.unmountComponentAtNode(node);
  document.body.removeChild(node);
}
