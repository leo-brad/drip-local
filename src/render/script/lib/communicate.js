import React from 'react';
import { updateContent, } from '~/render/script/action/content';
import { addInstance, reduceInstance, } from '~/render/script/action/instance';
import { updatePkg, } from '~/render/script/action/pkg';
import { restartMain, } from '~/render/script/action/main';
import { updateStatus, } from '~/render/script/action/status';

export default function communicate(store) {
  const { ipc, } = window;
  ipc.on('drip', (data) => {
    const [event,] = data;
    if (event === 'proc') {
      const [_, instance, field, string, ] = data;
      switch (field) {
        case 'stdout':
        case 'stderr':
          store.dispatch(updateContent({ instance, field, string, }));
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
      const [_, pkg] = data;
      store.dispatch(updatePkg(pkg));
    }
    if (event === 'restart') {
      store.dispatch(restartMain());
    }
  });
}

