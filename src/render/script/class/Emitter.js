class Emitter {
  constructor() {
    this.callbacks = {};
  }

  send(event, data) {
    const { callbacks, } = this;
    callbacks[event].forEach((callback) => {
      callback(data);
    });
  }

  on(event, callback) {
    const { callbacks, } = this;
    if (callbacks[event] === undefined) {
      callbacks[event] = [];
    }
    callbacks[event].push(callback);
  }

  remove(event, callback) {
    const cbs = this.callbacks[event];
    for (let i = 0; i < cbs.length; i += 1) {
      if (callback === cbs[i]) {
        cbs.splice(i, 1);
      }
    }
  }
}

export default Emitter;
