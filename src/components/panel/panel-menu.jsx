import React from 'react';
import classNames from 'classnames';
import {DropdownButton, MenuItem} from 'react-bootstrap';

var PanelMenu = React.createClass({

  displayName: 'PanelMenu',

  propTypes: {
    // Called when a display mode is selected
    onDisplayMode: React.PropTypes.func,

    // Called when an action is selected
    onAction: React.PropTypes.func,

    // Id of the current displayMode
    currentDisplayModeId: React.PropTypes.string,

    // Array of all available display modes
    // displayModes are retrieved from the getDisplayModes static method on Panel children
    displayModes: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      icon: React.PropTypes.string,
      label: React.PropTypes.string,
    })),

    // Array of all available actions
    // actions are retrieved from the getAction static method on Panel children
    actions: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      icon: React.PropTypes.string,
      label: React.PropTypes.string,
      // Name of the method to call on the mounted component this action targets
      methodName: React.PropTypes.string,
    })),
  },

  /**
   * Called when a display mode is selected
   * @param  {Object} displayMode
   */
  _handleDisplayModeSelect(displayMode) {
    if (this.props.onDiplayMode) {
      this.props.onDiplayMode(displayMode);
    }
  },

  /**
   * Called when an action is selected
   * @param  {Object} action
   */
  _handleActionSelect(action) {
    if (typeof this.props.onAction === 'function') {
      this.props.onAction(action);
    }
  },

  render() {
    var displayModes = this.props.displayModes.map((displayMode, idx) => {
      let disabled = displayMode.id === this.props.currentDisplayModeId;
      return (
        <MenuItem key={idx}
                  className={disabled && 'disabled'}
                  href={null}
                  onSelect={!disabled && this._handleDisplayModeSelect.bind(null, displayMode)}>
          {displayMode.icon &&
            <i className={classNames('fa', displayMode.icon)}/>
          }
          {displayMode.label}
        </MenuItem>
      );
    });

    var actions = this.props.actions.map((action, idx) => {
      if (action.type === 'divider') {
        return <MenuItem key={idx} divider />
      }

      return (
        <MenuItem key={idx}
                  href={action.href || null}
                  onSelect={this._handleActionSelect.bind(null, action)}>
          {action.icon &&
            <i className={classNames('fa', action.icon)}></i>
          }
          {action.label}
        </MenuItem>
      );
    });

    return (
      <DropdownButton noCaret
                      pullRight
                      className={classNames(this.props.className, 'PanelMenu')}
                      title={<i className="fa fa-gear"/>}>
        {displayModes}
        {displayModes.length > 0 && actions.length > 0 &&
          <MenuItem key="divider" divider />
        }
        {actions}
      </DropdownButton>
    );
  }

});

export default PanelMenu;
