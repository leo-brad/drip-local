class Location {
  constructor() {
    this.location = '/';
    this.callbacks = [];
  }

  onChange(callback) {
    this.callbacks.push(callback);
  }

  to(location) {
    this.location = location;
    this.callbacks.forEach((cb) => cb(location));
  }
}

export default Location;
