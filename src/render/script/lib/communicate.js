import React from 'react';
import { updateContent, } from '~/render/script/action/content';
import { addInstance, reduceInstance, } from '~/render/script/action/instance';
import { updatePlugins, } from '~/render/script/action/plugins';

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
      const [_, plugins,] = data;
      store.dispatch(updatePlugins(plugins));
    }
    console.log(JSON.stringify(store.getState()));
  });
}
