import React from 'react';
import { addInstance, reduceInstance, } from '~/render/script/action/instance';
import { restartMain, } from '~/render/script/action/main';
import { updateStatus, } from '~/render/script/action/status';
import addPkgs from '~/render/script/lib/addPkgs';
import global from '~/render/script/obj/global';

export default function communicate(store) {
  const { emitter, } = global;
  const { ipc, } = window;
  ipc.on('drip', (data) => {
    const [event,] = data;
    if (event === 'proc') {
      const [_, instance, field, string, ] = data;
      switch (field) {
        case 'stdout':
        case 'stderr':
          emitter.send('content/update', { instance, field, string, });
          store.dispatch(updateStatus({ instance, field, }));
          break;
        case 'new':
          store.dispatch(addInstance(instance));
          break;
        case 'end':
          store.dispatch(reduceInstance(instance));
          break;
        default:
          break;
      }
    }
    if (event === 'pkg') {
      const [_, pkgs] = data;
      addPkgs(pkgs);
    }
    if (event === 'restart') {
      store.dispatch(restartMain());
      emitter.send('content/reset');
    }
  });
}

