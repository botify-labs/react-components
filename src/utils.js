import _ from 'lodash';

/**
 * Clones the statics of a ReactClass
 * This can be used to expose statics from a composed component in a higher-order component
 * @param  {ReactClass} Component   Composed component
 * @return {Object}                 Map of statics
 */
export function cloneStatics(Component) {
  return _.omit(Component, [
    'displayName',
    'mixins',
    'childContextTypes',
    'contextTypes',
    'getDefaultProps',
    'propTypes',
    'statics',
  ]);
}
