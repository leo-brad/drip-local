export function done(check, callback) {
  const id = setInterval(() => {
    if (check()) {
      clearInterval(id);
      callback();
    }
  }, 1000 / 29);
}
