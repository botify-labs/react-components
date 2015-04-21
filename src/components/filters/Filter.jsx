import React, { PropTypes } from 'react/addons';
import _ from 'lodash';
import classNames from 'classnames';

import Select from '../inputs/Select';
import ButtonSelect from '../inputs/ButtonSelect';

import InputMixin from '../../mixins/InputMixin';
import { areaOptionShape } from '../../shapes/option';

const Filter = React.createClass({

  displayName: 'Filter',

  mixins: [
    InputMixin(PropTypes.shape({
      areaId: PropTypes.string,
      filterId: PropTypes.string,
      filterValue: PropTypes.any,
    }))
  ],

  propTypes: {
    className: PropTypes.string,
    areaOptions: PropTypes.arrayOf(areaOptionShape).isRequired,
    defaultAreaId: PropTypes.string,
    onRemove: PropTypes.func.isRequired,
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

    // Filters can be nested in group
    // The following finds filters with a maximum nesting depth of 1
    let found;
    for (let i = 0; i < filterOptions.length; i++) {
      let option = filterOptions[i];
      // Option groups are identified by an `isGroup` property set to `true`
      if (option.isGroup) {
        found = _.find(option.options, { id: filterId });
        if (found) {
          break;
        }
      } else if (option.id === filterId) {
        found = option;
        break;
      }
    }

    return found;
  },

  _handleFilterTypeChange(newFilterId) {
    let { filterId, filterValue } = this.getValue();

    let filter = this._getFilter(filterId);
    let newFilter = this._getFilter(newFilterId);

    this.update({
      filterId: { $set: newFilterId },
      // Filter types can define a `getInitialValue(prevType, prevValue)` static method to choose how
      // to transition from a previous filter type and value. The return value of this method will be
      // set as the new value of the filter.
      filterValue: { $set: newFilter.type.getInitialValue((filter && filter.type), filterValue) }
    });
  },

  _handleAreaChange(newAreaId) {
    let { filterId, filterValue } = this.getValue();
    let area = this._getArea(newAreaId);
    let filter = this._getFilter(filterId, area);

    if (!filter) {
      // The previously selected filter doesn't exist in this area
      // @TODO: define a `getInitialValue()` for areas? might be needed since similar area fields will
      // have different ids between areas (ex: `host`, `previous.host`)
      filterId = null;
      filterValue = null;
    }

    this.update({
      areaId: { $set: newAreaId },
      filterId: { $set: filterId },
      filterValue: { $set: filterValue },
    });
  },

  render() {
    let { areaOptions, onRemove, className } = this.props;
    let { filterId, areaId } = this.getValue();
    let area = this._getArea();
    let filter = this._getFilter(filterId);

    return (
      <div className={classNames('Filter', className)}>
        {/* Do not display the area select when there is only one area option and it is already selected */}
        {(areaOptions.length > 1 || !area) &&
          <ButtonSelect
            className="Filter-area"
            options={areaOptions}
            {...this.link(areaId, this._handleAreaChange)}
            />
        }
        <Select
          className="Filter-filterOptions"
          options={area.filterOptions}
          nullLabel="Add a filter"
          {...this.link(filterId, this._handleFilterTypeChange)}
          />
        {/* When `filterId` isn't defined, the filter is a dummy */}
        {filterId &&
          <filter.type
            className="Filter-filterType"
            {...this.linkValue('filterValue')}
            />
        }
        {filterId &&
          <button
            className="Filter-remove btn btn-danger"
            onClick={onRemove}
            >
            x
          </button>
        }
      </div>
    );
  }

});

export default Filter;
