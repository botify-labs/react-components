# Select

We have a couple of `select`-type components, namely `Select` and `ButtonSelect`. They all accept an `options` prop which is an array of `Option`. `Select` also accepts `OptionGroup` instead of `Option` in its `options` prop.

```js
struct Option {
  id: String,
  label: String,
}

struct OptionGroup {
  isGroup: Boolean, // always true
  id: String,
  label: String,
  options: Array<Option>,
}
```
