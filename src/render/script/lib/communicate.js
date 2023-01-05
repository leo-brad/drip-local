import React from 'react';
import addPkgs from '~/render/script/lib/addPkgs';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
} = global;

export default function communicate(store) {
  const { ipc, } = window;
  ipc.on('drip', (data) => {
    const [event,] = data;
    switch (event) {
      case 'proc': {
        const [_, instance, field, string, ] = data;
        switch (field) {
          case 'stdout':
          case 'stderr': {
            let event;
            emitter.send('content/update', { instance, field, string, });
            emitter.send(instance, [event]);
            emitter.send('status/update', { instance, field, });
            event = 'status/update';
            emitter.send(instance, [event]);
            break;
          }
          case 'new': {
            emitter.send('instance/add', instance);
            const event = 'instance/add';
            emitter.send(instance, [event]);
            break;
          }
          case 'end': {
            emitter.send('instance/reduce', instance);;
            break;
          }
          default:
            break;
        }
        break
      }
      case 'pkg': {
        const [_, pkgs] = data;
        addPkgs(pkgs);
        break;
      }
      case 'restart': {
        emitter.send('content/reset');
        break;
      }
    }
  });
}

