import global from '~/render/script/obj/global';

async function block() {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 750);
  });
  if (!global.share.focus) {
    block();
  }
}

const {
  share: {
    emitter,
  },
  component,
} = global;

export default function dealEvent() {
  let blurTimes = 0;
  window.addEventListener('focus', (e) => {
    const { instance, } = global;
    global.share.focus = true;
    const event = 'window/focus';
    emitter.send(event);
    emitter.send(instance, [event]);
  });
  window.addEventListener('blur', (e) => {
    if (blurTimes >= 2) {
      const { instance, } = global;
      global.share.focus = false;
      const event = 'window/blur';
      emitter.send(event);
    } else {
      blurTimes += 1;
    }
    block();
  });
  let flag = true;
  window.addEventListener('resize', (e) => {
    const event = 'window/resize';
    const {
      instance,
    } = global;
    if (flag) {
      emitter.send(event);
      flag = false;
      setTimeout(() => {
        flag = true;
      }, 1000 / 29);
    }
  });
}
