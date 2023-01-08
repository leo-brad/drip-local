import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
} = global;

function syncContent() {
  emitter.on('content/update', (data) => {
    const {
      content,
    } = global;
    const { instance, field, string, } = data;
    if (field === 'stderr') {
      new Notification(
        'drip',
        { body:  'instance ' + instance +  ' happen a wrong.', },
      );
    }
    let i = content[instance];
    if (!Array.isArray(i)) {
      content[instance] = [];
    }
    i = content[instance];
    i.push({ field, string, });
  });
}

function syncInstance() {
  emitter.on('instance/add', (instance) => {
    const {
      instances,
    } = global;
    if (instances.length === 0) {
      global.instance = instance;
      setTimeout(() => {
        const event = 'instance/add/first';
        emitter.send(instance, [event]);
      }, 0);
    }
    global.instances.push(instance);
  });
  emitter.on('instance/reduce', (instance) => {
    for (let i = 0; i < instances.length; i += 1) {
      if (instance === instances[i]) {
        global.instances.splice(i, 1);
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

function clearComponent() {
  const {
    component,
  } = global;
  Object.keys(component).forEach((k) => {
    let event = 'unmount';
    emitter.send(k, [event]);
  });
  global.component = {};
}

function syncMain() {
  emitter.on('main/reset', () => {
    global.pkg = {};
    clearComponent();
    global.content = {};
    global.instance = '';
    global.instances = [];
    global.status = {};
    global.share = {
      emitter,
      focus: true,
    };
  });
}

export default function syncData() {
  syncContent();
  syncInstance();
  syncStatus();
  syncMain();
}
