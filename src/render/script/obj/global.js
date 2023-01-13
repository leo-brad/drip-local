import Emitter from '~/render/script/class/Emitter';

const emitter = new Emitter();

const global = {
  error: null,
  pkg: {},
  content: {},
  component: {},
  instance: '',
  instances: [],
  status: {},
  share: {
    emitter,
    focus: true,
  },
};

export default global;
