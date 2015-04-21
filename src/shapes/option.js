import { PropTypes } from 'react';

const optionSchema = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export const optionShape = PropTypes.shape(optionSchema);

export const componentOptionShape = PropTypes.shape({
  ...optionSchema,
  type: PropTypes.func.isRequired, // Rendered whenever the ComponentOption is selected
});

export function optionGroupOf(shape) {
  return PropTypes.oneOfType([
    PropTypes.shape({
      isGroup: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(shape).isRequired,
    }),
    shape
  ]);
}

export const areaOptionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  filterOptions: PropTypes.arrayOf(optionGroupOf(componentOptionShape)).isRequired,
});
