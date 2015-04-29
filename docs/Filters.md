# Filters

## Component options

`filterOptions` is an array of `InputOption`.

```
struct InputOption extends Option {
  input: ReactClass, // Rendered whenever the `InputOption` is selected
}
```

`option.input` can implement the [Controlled Input](Controlled-Inputs.md) prop interface.
