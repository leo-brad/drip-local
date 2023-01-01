class Emitter {
  constructor() {
    this.id = 0;
    this.callbacks = {};
  }

  send(event, data) {
    const { callbacks, } = this;
    callbacks[event].forEach(({ callback, }) => callback(data));
  }

  getId() {
    return this.id;
  }

  on(event, callback) {
    const { callbacks, } = this;
    if (callbacks[event] === undefined) {
      callbacks[event] = [];
    }
    this.id += 1;
    const { id, } = this;
    callbacks[event].push({ id, callback, });
  }

  remove(event, removeId) {
    const cbs = this.callbacks[event];
    for (let i = 0; i < cbs.length; i += 1) {
      const { id, callback, } = cbs[i];
      if (id === removeId) {
        cbs.splice(i, 1);
      }
    }
  }
}

export default Emitter;
