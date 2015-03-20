"use strict";

var UniqueIdMixin = {

  componentWillMount: function componentWillMount() {
    this._id = _.uniqueId();
  },

  _getId: function _getId(id) {
    return "" + this._id + "." + id;
  }

};

module.exports = UniqueIdMixin;
//# sourceMappingURL=../../components/svg/UniqueIdMixin.js.map