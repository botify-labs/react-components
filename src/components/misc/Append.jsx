import React, { PropTypes } from 'react/addons';

const Append = React.createClass({

  displayName: 'Append',

  propTypes: {
    to: PropTypes.instanceOf(Node).isRequired,
    children: PropTypes.element.isRequired,
  },

  componentWillMount() {
    this._container = document.createElement('div');
    this.props.to.appendChild(this._container);
  },

  componentDidMount() {
    React.render(this.props.children, this._container);
  },

  componentDidUpdate() {
    React.render(this.props.children, this._container);
  },

  componentWillUnmount() {
    this.props.to.removeChild(this._container);
  },

  render() {
    return null;
  },

});

export default Append;
