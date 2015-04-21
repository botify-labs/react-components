# Filters

## Component options

`filterOptions` is an array of `ComponentOption`.

```
struct ComponentOption extends Option {
  type: OptionType, // Rendered whenever the ComponentOption is selected
}

component OptionType extends ControlledInput {
  statics: {
    // OptionTypes can define a `getInitialValue(prevType, prevValue)` static
    // method to choose how to transition from a previous type and value.
    getInitialValue(prevType, prevValue),
  },
}
```

## Example

```js
const FilterType = React.createClass({
  statics: {
    getInitialValue(prevType, prevValue) {
      // Conserve value when transitioning from this type to this same type,
      // otherwise return a default value
      return prevType === FilterType ? prevValue : defaultValue;
    }
  },
});
```

## PredicateFilterType

A utility method is provided to create filter types that compose PredicateFilterBaseType.

```js
const StringPFType = createPredicateFilterType('StringPredicateFilterType', {
  operatorOptions: [
    {
      id: 'equals',
      label: 'Equals',
      type: StringInput,
    },
    {
      id: 'contains',
      label: 'Contains',
      type: StringInput,
    }
  ],
  defaultValue: {
    operatorId: 'equals',
    operatorValue: 'default value',
  }
});
```
