import path from 'path';
import fs from 'fs';
import { contextBridge, } from 'electron';
import configExec from '~/main/lib/configExec';
import Ipc from '~/main/class/Ipc';

const ipc = new Ipc();
contextBridge.exposeInMainWorld('ipc', {
  on: ipc.on.bind(ipc),
});

setTimeout(() => {
  const message = JSON.parse(fs.readFileSync(path.join(__dirname, 'message')));
  const {
    argv,
  } = message;
  const [configString, projectPath] = argv;
  const config = JSON.parse(configString);
  configExec(config, projectPath, ipc);
}, 10);
