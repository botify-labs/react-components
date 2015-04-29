# Controlled Inputs

Controlled input components **should** receive a `valueLink` prop of the form:

```
{
  value: PropTypes.any,           // The current value of the input
  requestChange: PropTypes.func,  // Function to call with the new value whenever the input's value should be updated
}
```

This mirrors the way standard React `<input>` components work. See [Two-Way Binding Helpers](https://facebook.github.io/react/docs/two-way-binding-helpers.html).

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
        <StringInput valueLink={{
          value: this.state.firstName,
          requestChange: this._handleValueChange.bind(null, 'firstName'),
        }} />
        <StringInput valueLink={{
          value: this.state.lastName,
          onChange: this._handleValueChange.bind(null, 'lastName'),
        }} />
      </div>
    );
  }
});

const StringInput = React.createClass({
  render() {
    return <input type="text" valueLink={this.props.valueLink} />;
  }
});
```

## InputMixin

An `InputMixin` mixin is provided to make it easier to implement the Controlled Input prop interface. The previous example could be rewritten as:

```js
const TopLevelInput = React.createClass({
  mixins: [InputMixin(PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }))],

  render() {
    return (
      <div>
        <StringInput valueLink={this.linkValue('firstName')} />
        <StringInput valueLink={this.linkValue('lastName')} />
      </div>
    );
  }
});
```

The only difference is that `TopLevelInput` is stateless. A higher-level component should render `TopLevelInput` and update its props it whenever it requests change to its value via its `valueLink.requestChange` prop. In `InputMixin`, the `valueLink.requestChange` prop is abstracted away by a `requestChange` method assigned to component instances.

Using `InputMixin` should always be privileged over implementing the `ControlledInput` interface manually, as it provides implementation-independent helpers to work with nested inputs.

## getDefaultValue()

Sometimes, it makes sense for an input to declare its own default value. Controlled input types can expose a `getDefaultValue()` static method that should return the default value for the input.

A `getDefaultValue(type)` utility method is provided in the `InputMixin` module that will not throw when `type` doesn't expose a `getDefaultValue()` static method.
