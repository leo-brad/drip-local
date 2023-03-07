import path from 'path';
import fs from 'fs';
import { contextBridge, } from 'electron';
import Ipc from '~/main/class/Ipc';
import EventEmitter from 'events';
import Instance from '~/main/class/Instance';
import EventSchedule from '~/main/class/EventSchedule';

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

    process.chdir(projectPath);
    const emitter = new EventEmitter();
    const pps = new Instance(config, emitter).getPriProcs();
    new EventSchedule(pps, emitter, config, ipc).start();
  } catch (e) {
    ipc.send('drip/error', e);
  }
}, 20);
