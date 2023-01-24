function step(chk, resolve) {
  if (chk()) {
    resolve();
  } else {
    setTimeout(step, 1000 / 29, chk, resolve);
  }
}

export default function check(chk) {
  return new Promise((resolve, reject) => {
    setTimeout(step, 1000 / 29, chk, resolve);
  });
}
