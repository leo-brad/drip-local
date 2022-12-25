import EventEmitter from 'events';
import Instance from '~/main/class/Instance';
import EventSchedule from '~/main/class/EventSchedule';

function configExec(config, projectPath, ipc) {
  process.chdir(projectPath);
  const emitter = new EventEmitter();
  const pps = new Instance(config, emitter).getPriProcs();
  new EventSchedule(pps, emitter, config, ipc).start();
}

export default configExec;
