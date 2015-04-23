let uniqueId = 0;

const UniqueIdMixin = {

  componentWillMount() {
    this._id = uniqueId++;
  },

  _getId(id) {
    return `${this._id}.${id}`;
  },

};

export default UniqueIdMixin;
