import path from 'path';
import net from 'net';
import os from 'os';
import InstanceCache from '~/main/class/InstanceCache';
import InstanceIndex from '~/main/class/InstanceIndex';
import WatchPath from '~/main/class/WatchPath';
import getPoolSize from '~/main/lib/getPoolSize';
import ProcPool from '~/main/class/ProcPool';
import { getPackages, } from '~/main/lib/package';

class EventSchedule {
  constructor(pps, emitter, config, ipc) {
    this.pool = [];
    this.config = config;
    this.emitter = emitter;
    this.ipc = ipc;
    this.pps = pps;
    this.ii = new InstanceIndex(2);
    this.ic = new InstanceCache();
    this.size = getPoolSize(config);
    this.wp = new WatchPath(emitter, config);
  }

  start() {
    this.sendPackages();
    this.bindEvent();
    this.wp.start();
    this.fillProcPool();
  }

  writeData(data) {
    const { ipc, } = this;
    ipc.send('drip/data', data);
  }

  sendPackages() {
    const packages = getPackages();
    const event = 'pkg';
    this.writeData([event, packages]);
  }

  fillProcPool(location) {
    this.pp = new ProcPool(this.size);
    const { pps, pp, } = this;
    pps.forEach(({ pri, proc, }) => {
      pp.addPriProc(pri, proc);
    });
    pp.updatePool();
    this.pool = pp.getPool().map((proc) => proc.start());
  }

  cleanProcPool() {
    const { pool, } = this;
    for (let i = 0; i < pool.length; i += 1) {
      pool[i].getProc().kill(2);
    }
    const event = 'restart';
    this.writeData([event]);
  }

  checkFreeMemory() {
    const {
      minMem,
    } = this.config;
    let ans = true;
    if (os.freemem() / 1024 ** 2 > minMem) {
      ans = false;
    }
    return ans;
  }

  bindEvent() {
    const { ic, emitter, socket, } = this;
    emitter.on('file', (eventType, location) => {
      if (
        /^\.drip\/local\/instance\/\[(\w+)\]:(\w+)$/
        .test(path.relative('.', location))
      ) {
        const regexp = /^\.drip\/local\/instance\/\[(\w+)\]:(\w+)$/
        const [_, pkg, instance] = path.relative('.', location).match(regexp);
        const { ii, } = this;
        const record = ii.indexInstance(location);
        ic.cache(pkg, instance, record);
      } else {
        this.cleanProcPool();
        this.fillProcPool(location);
      }
    });
    emitter.on('proc', async ({ field, instance, data='', }) => {
      const event = 'proc';
      switch (field) {
        case 'end':
          break;
      }
      this.writeData([event, instance, field, data,]);
    });
  }
}

export default EventSchedule;
