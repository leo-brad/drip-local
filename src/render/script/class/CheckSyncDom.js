class CheckSyncDom {
  constructor(check, callback) {
    this.check = check;
    this.done = false;
    this.callback = callback;
    this.step = this.step.bind(this);
  }

  start() {
    requestAnimationFrame(this.step);
  }

  step() {
    const { check, callback, } = this;
    this.done = check();
    const { done, } = this;
    if (check()) {
      callback();
    } else {
      requestAnimationFrame(this.step);
    }
  }
}

export default CheckSyncDom;
