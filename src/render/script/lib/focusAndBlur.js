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

export default function onlineAndOffline() {
  const {
    share: {
      emitter,
    },
    component,
  } = global;
  let blurTimes = 0;
  window.addEventListener('focus', (e) => {
    const { instance, } = global;
    global.share.focus = true;
    const event = 'window/focus';
    emitter.send(instance, [event]);
  });
  window.addEventListener('blur', (e) => {
    if (blurTimes >= 2) {
      const { instance, } = global;
      global.share.focus = false;
      const event = 'window/blur';
      emitter.send(instance, [event]);
    } else {
      blurTimes += 1;
    }
    block();
  });
}
