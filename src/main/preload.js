import path from 'path';
import fs from 'fs';
import net from 'net';
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

async function main() {
  try {
    const socket = net.connect({
      port: 8124,
    });
    const argv = await new Promise((resolve, reject) => {
      socket.on('data', (data) => {
        resolve(data.toString().split(' '));
      });
    });
    const [configJson, projectPath] = argv;
    const config = JSON.parse(configJson);
    process.chdir(projectPath);
    const emitter = new EventEmitter();
    const pps = new Instance(config, emitter).getPriProcs();
    new EventSchedule(pps, emitter, config, ipc).start();
  } catch (e) {
    ipc.send('drip/error', e);
  }
}

setTimeout(main, 10);
