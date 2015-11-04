import { PropTypes } from 'react';
import update from 'react-addons-update';


/**
 * Mixin that helps with implementing the controlled input interface.
 * @param   {Function} valueValidator PropTypes-style validator for the `value` prop
 * @return  {Object}                  Mixin
 */
export default function InputMixin(valueValidator) {
  return {
    propTypes: {
      // InputMixin only supports `valueLink`, not the `value` and `onChange` props.
      // This is because in React input components, `onChange` is called with an event
      // as its first argument, a behavior that we cannot replicate.
      valueLink: PropTypes.shape({
        value: valueValidator,
        requestChange: PropTypes.func.isRequired,
      }).isRequired,
    },

    /**
     * Update the value of the component with the provided commands
     * @param  {Any} commands Update commands, see https://facebook.github.io/react/docs/update.html
     */
    requestChange(commands) {
      const { requestChange, value } = this.props.valueLink;
      requestChange(update(value, commands));
    },

    /**
     * Returns the current value of the input. Along with `update(1)`, this allows components that implement
     * the mixin to not depend on the implementation of the mixin.
     * @return {Any}
     */
    getValue(props = this.props) {
      return props.valueLink.value;
    },

    /**
     * Helper to create a link from a value and a `requestChange` function
     * @param  {Any}      value
     * @param  {Function} requestChange Function to call whenever the value should be updated
     * @return {Object}                 Link
     */
    link(value, requestChange) {
      return { value, requestChange };
    },

    /**
     * Helper to link a child input to a value nested in its parent's value
     * @param  {String} key Key of the nested value. If left empty, the parent value will be used directly.
     * @return {Object}     Link
     */
    linkValue(key) {
      if (key) {
        return {
          value: this.getValue()[key],
          requestChange: (newValue) => {
            this.requestChange({ [key]: { $set: newValue } });
          },
        };
      }

      return {
        value: this.getValue(),
        requestChange: (newValue) => {
          this.requestChange({ $set: newValue });
        },
      };
    },
  };
}

/**
 * Utility function to retrieve the default value of a given input type provided it exposes a `getDefaultValue` static.
 * @param  {Function} input React Component Class
 * @return {Any}            Default value
 */
export function getDefaultValue(input) {
  return (input && typeof input.getDefaultValue === 'function') ? input.getDefaultValue() : null;
}
