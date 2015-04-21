# Controlled inputs

```
component ControlledInput {
  propTypes: {
    onChange: PropTypes.func,
    value: PropTypes.any,
  }
}
```

Input components **should** receive a `value` prop that contains their current value.

Input components **should** receive a `onChange(newValue)` prop that **should** be called when the component's value is changed by user input. Any change to an input component's value is thus propagated up the tree. The `newValue` argument *should* be in a format acceptable by the `value` prop, as in most cases it will replace it, although that logic is left to the parent component.

This mirrors the way standard React `<input>` components work, with the only difference being that the `onChange()` prop's first argument is not an event but a value.

```js
const { update } = React.addons;

const TopLevelInput = React.createClass({
  getInitialState() {
    return {
      value: {
        firstName: 'Hello',
        lastName: 'World',
      }
    }
  },

  _handleValueChange(key, newValue) {
    this.setState({
      value: update(this.state.value, {
        [key]: { $set: newValue }
      })
    });
  },

  render() {
    return (
      <div>
        <StringInput value={this.state.firstName} onChange={this._handleValueChange.bind(null, 'firstName')} />
        <StringInput value={this.state.lastName} onChange={this._handleValueChange.bind(null, 'lastName')} />
      </div>
    );
  }
});

const StringInput = React.createClass({
  render() {
    return <input type="text" value={this.props.value} onChange={(e) => this.props.onChange(e.target.value)} />;
  }
});
```

## InputMixin

An `InputMixin` mixin is provided to make it easier to implement `ControlledInput`s. The previous example could be rewritten as:

```js
const TopLevelInput = React.createClass({
  mixins: [InputMixin],

  _handleValueChange(key, newValue) {
    this.update({
      [key]: { $set: newValue }
    });
  },

  render() {
    return (
      <div>
        <StringInput {...this.linkValue('firstName')} />
        <StringInput {...this.linkValue('lastName')} />
      </div>
    );
  }
});

const StringInput = React.createClass({
  render() {
    return (
      <input
        type="text"
        value={this.props.value}
        onChange={(e) => this.props.onChange(e.target.value)}
        />
    );
  }
});
```

The only difference is that `TopLevelInput` is stateless. A higher-level component should render `TopLevelInput` and update its props whenever it calls its `onChange` prop.

Using `InputMixin` should always be privileged over implementing the `ControlledInput` interface manually, as it provides implementation-independent helpers to work with nested inputs.
