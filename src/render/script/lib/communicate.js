import React from 'react';
import { updateContent, } from '~/render/script/action/content';
import { addInstance, reduceInstance, } from '~/render/script/action/instance';
import { updatePkg, } from '~/render/script/action/pkg';

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
    if (event === 'package') {
      const [_, pkg,] = data;
      store.dispatch(updatePkg(pkg));
    }
  });
}
