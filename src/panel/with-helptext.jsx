import React from 'react/addons';
import Panel from './panel';

var CustomPanel = React.createClass({

  displayName: 'CustomPanel',

  getInitialState() {
    return {
      showHelpText: false
    };
  },

  render() {
    var helptextIcon = (
      <button onClick={this._handleHelpToggle}>
        <i className="fa fa-help" />
      </button>
    );

    return (
      <Panel actions={[helptextIcon]} {...props}>
        {this.state.showHelpText &&
          <div className="Panel-helpText">
            {this.props.helpText}
          </div>
        }
        {children}
      </Panel>
    );
  },

  _handleHelpToggle() {
    this.setState({
      showHelpText: true
    });
  }

});

<SubinfoPanel panelClass={CustomPanel} />

var SubinfoPanel = React.createClass({

  displayName: 'SubinfoPanel',

  render() {
    var subInfo = (
      <div>{this.props.subInfo}</div>
    );

    return (
      <this.props.panelClass {...props}>
        {children}
        {subInfo}
      </Panel>
    );
  }

});

export default CustomPanel;