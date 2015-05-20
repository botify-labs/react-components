import React, { PropTypes } from 'react/addons';

let Positioned = React.createClass({

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
    let node = React.findDOMNode(this);

    this.setState({
      width: node.offsetWidth,
      height: node.offsetHeight,
    });
  },

  componentDidUpdate(prevProps, prevState) {
    let node = React.findDOMNode(this);
    let width = node.offsetWidth;
    let height = node.offsetHeight;

    if (width !== prevState.width || height !== prevState.height) {
      this.setState({
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    }
  },

  render() {
    let { style, children, ...otherProps } = this.props;
    style = { ...this._getCommonStyle(), ...this._getPositionStyle(), ...style };

    return (
      <div {...otherProps} className="Positioned" style={style}>
        {children}
      </div>
    );
  },

  _getCommonStyle() {
    return { position: 'fixed', pointerEvents: 'none' };
  },

  _getPositionStyle() {
    let { width, height } = this.state;
    if (width === null) {
      // The component hasn't rendered yet
      return { top: -9999, left: -9999 };
    }

    let positionStyle = {};
    let { position, margin } = this.props;
    let containerWidth = document.body.offsetWidth;

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

});

export default Positioned;
