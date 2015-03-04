import React from 'react/addons';
import classNames from 'classnames';
import _ from 'lodash';

import PanelMenu from './panel-menu';

import 'font-awesome/css/font-awesome.css';
import './style.scss';

var Panel = React.createClass({

  displayName: 'Panel',

  propTypes: {
    title: React.PropTypes.string, // Panel title
    displayModes: React.PropTypes.array,
    actions: React.PropTypes.array
  },

  getInitialState() {
    return {
      currentDisplayModeId: this.props.defaultDisplayModeId
    };
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
    action.callback();
  },

  render() {
    var displayModes = this.props.displayModes;
    var actions = this.props.actions;

    var currentDisplayMode = _.find(displayModes, {id: this.state.currentDisplayModeId});

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
          {currentDisplayMode.render()}
        </div>
      </div>
    );
  }

});

export default Panel;
