import global from '~/render/script/obj/global';

export default function onlineAndOffline(store) {
  const { emitter, component, } = global;
  window.addEventListener('focus', (e) => {
    const { instance: { instance, } } = store.getState();
    const event = 'window/focus';
    emitter.send(instance, [event]);
  });
  window.addEventListener('blur', (e) => {
    const { instance: { instance, } } = store.getState();
    const event = 'window/blur';
    emitter.send(instance, [event]);
  });
}
