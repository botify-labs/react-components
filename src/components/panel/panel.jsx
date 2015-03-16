import React, {PropTypes} from 'react/addons';
import classNames from 'classnames';
import _ from 'lodash';

import PanelMenu from './panel-menu';

import './style.scss';

var Panel = React.createClass({

  displayName: 'Panel',

  propTypes: {
    title: PropTypes.node,
    titleActions: PropTypes.node,
    headerActions: PropTypes.node,
    displayModes: PropTypes.array,
    defaultDisplayModeId: PropTypes.string,
    // TODO: Maybe replace actions with PropTypes.node
    actions: PropTypes.array
  },

  getDefaultProps() {
    return {
      title: '',
      displayModes: [],
      actions: [],
    };
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
    let {
      displayModes, actions, className, title, titleActions,
      headerActions, children, ...otherProps
    } = this.props;

    var currentDisplayMode = _.find(displayModes, {id: this.state.currentDisplayModeId});

    return (
      <div className={classNames(className, 'Panel')} {...otherProps}>
        <div className="Panel-header">
          <div className="Panel-titleWrapper">
            <div className="Panel-title" title={title}>
              {title}
            </div>
            {titleActions &&
              <div className="Panel-titleActions">
                {titleActions}
              </div>
            }
          </div>
          <div className="Panel-actions">
            {headerActions}
            <PanelMenu currentDisplayModeId={this.state.currentDisplayModeId}
                       displayModes={displayModes}
                       actions={actions}
                       onAction={this._handleAction}
                       onDiplayMode={this._handleDisplayMode}/>
          </div>
        </div>
        <div className="Panel-body">
          {children}
          {currentDisplayMode.render()}
        </div>
      </div>
    );
  }

});

export default Panel;
