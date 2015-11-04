import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Tooltip = React.createClass({

  displayName: 'Tooltip',

  propTypes: {
    className: PropTypes.string,
    children: PropTypes.node,
  },

  render() {
    const { className, children, ...otherProps } = this.props;

    return (
      <div {...otherProps} className={classNames('Tooltip', className)}>
        {children}
      </div>
    );
  },

});

export default Tooltip;
