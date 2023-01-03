import global from '~/render/script/obj/global';

const { emitter, } = global;

function syncContent() {
  const {
    index,
    contents,
  } = global;
  emitter.on('content/update', (data) => {
    const { instance, field, string, } = data;
    if (field === 'stderr') {
      new Notification(
        'drip',
        { body:  'instance ' + instance +  ' happen a wrong.', },
      );
    }
    if (index[instance] === undefined) {
      index[instance] = contents.length;
      console.log(JSON.stringify(global.index));
    }
    const i = index[instance];
    if (!Array.isArray(contents[i])) {
      contents[i] = [];
    }
    contents[i].push({ field, string, });
  });
  emitter.on('content/reset', () => {
    global.index = {};
    global.content = [];
    global.component = {};
  });
}

function syncInstance() {
  const {
    instance,
    instances,
  } = global;
  emitter.on('instance/add', (instance) => {
    if (instances.length === 0) {
      global.instance = instance;
    }
    global.instances.push(instance);
  });
  emitter.on('instance/reduce', (instance) => {
    for (let i = 0; i < instances.length; i += 1) {
      if (instance === instances[i]) {
        global.instances.splice(i, 1);
        const event = 'instance/add/first';
        emitter.send(instance, [event]);
        break;
      }
    }
  });
  emitter.on('instance/change', (instance) => {
    global.instance = instance;
  });
  emitter.on('main/restart', () => {
    global = Object.assign(global, {
      instance: '',
      instances: [],
    });
  });
}

function syncStatus() {
  const { status, } = global;
  emitter.on('status/update', ({ instance, field, }) => {
    status[instance] = field;
  });
}

export default function syncData() {
  syncContent();
  syncInstance();
  syncStatus();
}
