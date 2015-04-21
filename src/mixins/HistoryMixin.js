import { addons } from 'react/addons';
const { update } = addons;

/**
 * Mixin that provides a layer on top of a component state for storing an history of states.
 */
export default {
  getInitialState() {
    return {
      history: [{
        state: this.getInitialHistoryState(),
        isInitial: true
      }],
      historyIndex: 0,
    };
  },

  _getCurrentHistoryEntry() {
    return this.state.history[this.state.historyIndex];
  },

  getCurrentHistoryState() {
    return this._getCurrentHistoryEntry().state;
  },

  _addHistoryEntry(newState, isInitial) {
    let currentState = this.getCurrentHistoryState();
    let history = this.state.history.slice(0, this.state.historyIndex + 1);
    history.push({
      isInitial,
      state: update(currentState, { $merge: newState }),
    });
    this.setState({ history, historyIndex: this.state.historyIndex + 1 });
  },

  setHistoryState(newState) {
    this._addHistoryEntry(newState, false);
  },

  canUndo() {
    return this.state.historyIndex > 0;
  },

  undo() {
    if (!this.canUndo()) {
      throw new Error('Cannot undo: no previous history state');
    }

    this.setState({
      historyIndex: this.state.historyIndex - 1
    });
  },

  canRedo() {
    return this.state.historyIndex < (this.state.history.length - 1);
  },

  redo() {
    if (!this.canRedo()) {
      throw new Error('Cannot redo: no next history state');
    }

    this.setState({
      historyIndex: this.state.historyIndex + 1
    });
  },

  canReset() {
    return !this._getCurrentHistoryEntry().isInitial;
  },

  reset() {
    if (!this.canReset()) {
      throw new Error('Cannot reset: current history state is initial history state');
    }

    this._addHistoryEntry(this.getInitialHistoryState(), true);
  }

};
