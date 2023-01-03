import global from '~/render/script/obj/global';

export default function onlineAndOffline(store) {
  const {
    emitter,
    component,
  } = global;
  let blurTimes = 0;
  window.addEventListener('focus', (e) => {
    const { instance, } = global;
    global.focus = true;
    const event = 'window/focus';
    emitter.send(instance, [event]);
  });
  window.addEventListener('blur', (e) => {
    if (blurTimes >= 2) {
      const { instance, } = global;
      global.focus = false;
      const event = 'window/blur';
      emitter.send(instance, [event]);
    } else {
      blurTimes += 1;
    }
  });
}
