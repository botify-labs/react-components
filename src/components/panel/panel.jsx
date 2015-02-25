import React from 'react/addons';
import classNames from 'classnames';
import _ from 'lodash';

import PanelMenu from './panel-menu';

import './style.scss';

var Panel = React.createClass({

  displayName: 'Panel',

  propTypes: {
    title: React.PropTypes.string // Panel title
  },

  getInitialState() {
    return {
      currentDisplayModeId: this._getDefaultDisplayModeId()
    };
  },

  /**
   * Returns the list of all available display modes on its children
   * @return {Array}
   */
  _getDisplayModes() {
    var displayModes = [];

    React.Children.forEach(this.props.children, (child) => {
      child.type.getDisplayModes().map((displayMode) => {
        var displayMode = _.clone(displayMode);
        displayMode.element = child;
        displayModes.push(displayMode);
      });
    });

    return displayModes;
  },

  /**
   * Returns the list of all available actions on its children
   * @return {Array}
   */
  _getActions() {
    var actions = [];

    React.Children.forEach(this.props.children, (child) => {
      child.type.getActions().map((action) => {
        var action = _.clone(action);
        action.element = child;
        action.key = child.key;
        actions.push(action);
      });
    });

    return actions;
  },

  /**
   * Returns the default display mode id
   * @return {Object}
   */
  _getDefaultDisplayModeId() {
    var count = React.Children.count(this.props.children);
    if (count === 0) {
      return null;
    }
    // this.props.children is supposedly opaque, so we try to use React.Children methods
    // as much as possible. However, React.Children doesn't expose a get() or a first() method,
    // so we have to improvise one.
    var firstChild =  React.Children.count(this.props.children) === 1 ?
                      React.Children.only(this.props.children) : this.props.children[0];
    return firstChild.type.getDefaultDisplayModeId();
  },

  /**
   * Called when a display mode is selected from the PanelMenu
   * Switches to the given display mode
   * @param {Object} displayMode
   */
  _handleDisplayMode(displayMode) {
    this.setState({currentDisplayModeId: displayMode.id});
  },

  /**
   * Called when an action is selected from the PanelMenu
   * Executes the given action
   * @param  {Object} action
   */
  _handleAction(action) {
    var component = this.refs[`__${action.key}`];
    component[action.methodName]();
  },

  render() {
    var displayModes = this._getDisplayModes();
    var actions = this._getActions();

    var currentDisplayMode = _.find(displayModes, {id: this.state.currentDisplayModeId});
    var currentElement = currentDisplayMode ? currentDisplayMode.element : null;

    var children = React.Children.map(this.props.children, (child) => {
      return (
        <div
          key={child.key}
          style={{display: child === currentElement ? 'block' : 'none'}}>
          {
            // We clone child elements to attach them to the panel via refs,
            // which are then used to execute actions on those elements once they are
            // mounted in the DOM.
            // We also edit their props to inform them of the current display mode.
            React.addons.cloneWithProps(child, {
              key: child.key,
              ref: `__${child.key}`,
              displayMode: child === currentElement ? currentDisplayMode.id : null
            })
          }
        </div>
      );
    });

    return (
      <div className={classNames(this.props.className, 'Panel')}>
        <div className="Panel-header">
          <div className="Panel-titleWrapper">
            <div className="Panel-title" title={this.props.title}>
              {this.props.title}
            </div>
          </div>
          <div className="Panel-actions">
            <PanelMenu  currentDisplayModeId={this.state.currentDisplayModeId}
                        displayModes={displayModes}
                        actions={actions}
                        onAction={this._handleAction}
                        onDiplayMode={this._handleDisplayMode}/>
          </div>
        </div>
        <div className="Panel-body">
          {children}
        </div>
      </div>
    );
  }

});

export default Panel;