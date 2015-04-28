# Filters

## Component options

`filterOptions` is an array of `InputOption`.

```
struct InputOption extends Option {
  input: InputType, // Rendered whenever the `InputOption` is selected
}

component InputType extends ControlledInput {
  statics: {
    // `InputType`s can define a `getDefaultValue()` static method that should return
    // the default value for the input
    getDefaultValue(prevType, prevValue),
  },
}
```

## PredicateFilterType

A utility method is provided to create filter inputs that compose PredicateBaseInput.

```js
const StringPredicateInput = createPredicateInput('StringPredicateInput', {
  predictateOptions: [
    {
      id: 'equals',
      label: 'Equals',
      input: StringInput,
    },
    {
      id: 'contains',
      label: 'Contains',
      input: StringInput,
    }
  ],
  defaultValue: {
    predicateId: 'equals',
    predicateInputValue: 'default value',
  }
});
```
