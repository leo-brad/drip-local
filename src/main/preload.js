import path from 'path';
import fs from 'fs';
import { contextBridge, } from 'electron';
import Ipc from '~/main/class/Ipc';
import configExec from '~/main/lib/configExec';

const ipc = new Ipc();
contextBridge.exposeInMainWorld(
  'ipc', {
    on: ipc.on.bind(ipc),
  }
);

setTimeout(() => {
  try {
    const message = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'message'))
    );
    const { argv, } = message;
    const [configString, projectPath] = argv;

    const config = JSON.parse(configString);
    configExec(config, projectPath, ipc);
  } catch (e) {
    ipc.send('drip/error', e);
  }
}, 12);
