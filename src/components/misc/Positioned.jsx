import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

const Positioned = React.createClass({

  displayName: 'Positioned',

  propTypes: {
    position: React.PropTypes.shape({
      top: React.PropTypes.number.isRequired,
      left: React.PropTypes.number.isRequired,
    }),
    margin: React.PropTypes.number,
    children: PropTypes.node,
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {
      margin: 10, // x and y margin between the mouse and the component
    };
  },

  getInitialState() {
    return {
      width: null,
      height: null,
    };
  },

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);

    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      width: node.offsetWidth,
      height: node.offsetHeight,
    });
  },

  componentDidUpdate(prevProps, prevState) {
    const node = ReactDOM.findDOMNode(this);
    const width = node.offsetWidth;
    const height = node.offsetHeight;

    if (width !== prevState.width || height !== prevState.height) {
      this.setState({ // eslint-disable-line react/no-did-update-set-state
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    }
  },

  _getCommonStyle() {
    return { position: 'fixed', pointerEvents: 'none' };
  },

  _getPositionStyle() {
    const { width, height } = this.state;
    if (width === null) {
      // The component hasn't rendered yet
      return { top: -9999, left: -9999 };
    }

    const positionStyle = {};
    const { position, margin } = this.props;
    const containerWidth = document.body.offsetWidth;

    // Calculate the best position for the component so that
    //  * it won't overlay its given focus position
    //  * it won't cross its container's boundaries

    if (position.top - height - margin > 0) {
      positionStyle.top = position.top - height - margin;
    } else {
      positionStyle.top = position.top + margin;
    }

    if (position.left - width / 2 > 0 && position.left + width / 2 < containerWidth) {
      positionStyle.left = position.left - width / 2;
    } else if (position.left - width - margin > 0) {
      positionStyle.left = position.left - width - margin;
    } else {
      positionStyle.left = position.left + margin;
    }

    return positionStyle;
  },

  render() {
    let { style } = this.props;
    const { children, ...otherProps } = this.props;
    style = { ...this._getCommonStyle(), ...this._getPositionStyle(), ...style };

    return (
      <div {...otherProps} className="Positioned" style={style}>
        {children}
      </div>
    );
  },

});

export default Positioned;
