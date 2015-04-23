import { PropTypes, addons } from 'react/addons';
const { update } = addons;

const VALUE_KEY = 'value';
const ONCHANGE_KEY = 'onChange';

/**
 * Mixin that helps with implementing the controlled input interface.
 * @param   {Function} valueValidator PropTypes-style validator for the `value` prop
 * @return  {Object}                  Mixin
 */
export default function InputMixin(valueValidator) {
  return {
    propTypes: {
      [VALUE_KEY]: valueValidator,
      [ONCHANGE_KEY]: PropTypes.func.isRequired,
    },

    /**
     * Update the value of the component with the provided commands
     * @param  {Any} commands Update commands, see https://facebook.github.io/react/docs/update.html
     */
    update(commands) {
      let { [ONCHANGE_KEY]: onChange, [VALUE_KEY]: value } = this.props;
      onChange(update(value, commands));
    },

    /**
     * Returns the current value of the input. Along with `update(1)`, this allows components that implement
     * the mixin to not depend on the implementation of the mixin.
     * @return {Any}
     */
    getValue() {
      return this.props[VALUE_KEY];
    },

    /**
     * Helper to pass a `value` and a `onChange` handler to a child input
     * @param  {Any}      value
     * @param  {Function} onChange
     * @return {Objects}            Props to be applied on the child input component
     */
    link(value, onChange) {
      return { [VALUE_KEY]: value, [ONCHANGE_KEY]: onChange };
    },

    /**
     * Helper to link a child input to a value nested in its parent's value
     * @param  {String} key Key of the nested value. If left empty, the parent value will be used directly.
     * @return {Object}     Props to be applied on the child input component
     */
    linkValue(key) {
      if (key) {
        return {
          [VALUE_KEY]: this.getValue()[key],
          [ONCHANGE_KEY]: (newValue) => {
            this.update({ [key]: { $set: newValue } });
          },
        };
      }

      return {
        [VALUE_KEY]: this.getValue(),
        [ONCHANGE_KEY]: (newValue) => {
          this.update({ $set: newValue });
        },
      };
    },
  };
}
