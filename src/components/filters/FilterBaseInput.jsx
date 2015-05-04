import React, { PropTypes } from 'react/addons';
import _ from 'lodash';
import classNames from 'classnames';

import Select from '../inputs/Select';
import ButtonSelect from '../inputs/ButtonSelect';

import InputMixin, { getDefaultValue } from '../../mixins/InputMixin';

const valuePropType = PropTypes.shape({
  areaId: PropTypes.string, // Id of the selected area in `props.areaOptions`.
  filterId: PropTypes.string, // Id of the selected filter in `props.areaOptions[areaId].filterOptions`
  filterInputValue: PropTypes.any, // Value of the selected filter, its format depends entirely on the filter input
});

const filterOptionPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  input: PropTypes.func.isRequired,
});

const areaOptionPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  filterOptions: PropTypes.arrayOf(Select.PropTypes.optionGroupOf(filterOptionPropType)).isRequired,
});

const areaOptionsPropType = PropTypes.arrayOf(areaOptionPropType);

const FilterBaseInput = React.createClass({

  displayName: 'FilterBaseInput',

  mixins: [
    InputMixin(valuePropType),
  ],

  propTypes: {
    className: PropTypes.string,
    // List of area options `{ id, label, filterOptions }`
    // `filterOptions` is a list of filter options `{ id, label, input }` or option group `{ isGroup, id, label, options }`
    areaOptions: areaOptionsPropType.isRequired,
    // Default area id to use when creating dummy filters
    defaultAreaId: PropTypes.string,
    // If defined, call this when the compound filter should be removed
    onRemove: PropTypes.func,
  },

  /**
   * Returns the current area
   */
  _getArea(areaId) {
    let { areaOptions } = this.props;
    areaId = areaId || this.getValue().areaId;
    return _.find(areaOptions, { id: areaId });
  },

  /**
   * Returns the filter with the given id
   * @param  {String} filterId
   */
  _getFilter(filterId, area = this._getArea()) {
    let { filterOptions } = area;
    return Select.getOption(filterOptions, filterId);
  },

  _handleFilterChange(newFilterId) {
    let { filterId, filterInputValue } = this.getValue();

    let filter = this._getFilter(filterId);
    let newFilter = this._getFilter(newFilterId);

    this.requestChange({
      filterId: { $set: newFilterId },
      filterInputValue: {
        // Conserve the previous value if the two inputs are compatible, otherwise use the default
        $set: (filter && newFilter.input === filter.input) ? filterInputValue : getDefaultValue(newFilter.input),
      },
    });
  },

  _handleAreaChange(newAreaId) {
    let { areaId, filterId, filterInputValue } = this.getValue();
    let area = this._getArea(areaId);
    let newArea = this._getArea(newAreaId);
    let filter = this._getFilter(filterId, area);
    let newFilter = this._getFilter(filterId, newArea);

    if (!newFilter) {
      // The previously selected filter doesn't exist in this area
      // @TODO: define a `getInitialValue()` for areas? might be needed since similar area fields will
      // have different ids between areas (ex: `host`, `previous.host`)
      filterId = null;
      filterInputValue = null;
    } else if (filter.input !== newFilter.input) {
      // Sometimes, input type can change between comparison groups (current => diff, boolean => string)
      filterInputValue = getDefaultValue(newFilter.input);
    }

    this.requestChange({
      areaId: { $set: newAreaId },
      filterInputValue: { $set: filterInputValue },
    });
  },

  render() {
    let { areaOptions, onRemove, className } = this.props;
    let { filterId, areaId } = this.getValue();
    let area = this._getArea();
    let filter = this._getFilter(filterId);

    return (
      <div className={classNames('FilterBaseInput', className)}>
        {/* Do not display the area select when there is only one area option and it is already selected */}
        {(areaOptions.length > 1 || !area) &&
          <ButtonSelect
            className="FilterBaseInput-area"
            options={areaOptions}
            valueLink={this.link(areaId, this._handleAreaChange)}
            />
        }
        <Select
          className="FilterBaseInput-filterOptions"
          options={area.filterOptions}
          nullLabel="Add a filter"
          valueLink={this.link(filterId, this._handleFilterChange)}
          />
        {/* When `filterId` isn't defined, the filter is a dummy */}
        {filterId &&
          <filter.input
            className="FilterBaseInput-filterInput"
            valueLink={this.linkValue('filterInputValue')}
            />
        }
        {onRemove &&
          <button
            className="FilterBaseInput-remove btn"
            onClick={onRemove}
            >
            x
          </button>
        }
      </div>
    );
  },

});

FilterBaseInput.PropTypes = {
  value: valuePropType,
  areaOptions: areaOptionsPropType,
};

export default FilterBaseInput;
