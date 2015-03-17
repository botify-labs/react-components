const UniqueIdMixin = {

  componentWillMount() {
    this._id = _.uniqueId();
  },

  _getId(id) {
    return `${this._id}.${id}`;
  }

};

export default UniqueIdMixin;
