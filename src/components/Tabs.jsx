import React, { PropTypes } from 'react';
import controllable from 'react-controllables';
import cx from 'classnames';
import _ from 'lodash';

const Tabs = React.createClass({

  displayName: 'Tabs',

  propTypes: {
    className: PropTypes.string,
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.node.isRequired,
        title: PropTypes.string,
        render: PropTypes.func.isRequired,
      })
    ).isRequired,
    selectedTabId: PropTypes.string,
    onSelectedTabIdChange: PropTypes.func.isRequired,
  },

  render() {
    let {
      className,
      tabs,
      selectedTabId = tabs[0].id,
      onSelectedTabIdChange,
    } = this.props;

    return (
      <div className={cx('Tabs', className)}>
        <div className="Tabs-nav">
          {tabs.map(tab => (
            <button
              className={cx('Tabs-navItem btn', tab.id === selectedTabId && 'active')}
              key={tab.id}
              title={tab.title}
              onClick={tab.id !== selectedTabId && onSelectedTabIdChange.bind(null, tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="Tabs-content">
          {_.find(tabs, { id: selectedTabId }).render()}
        </div>
      </div>
    );
  },

});

export default controllable(Tabs, ['selectedTabId']);
