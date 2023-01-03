import Emitter from '~/render/script/class/Emitter';

const emitter = new Emitter();

const global = {
  emitter,
  pkg: {},
  content: {
    index: {},
    contents: [],
  },
  component: {},
  focus: true,
  instance: '',
  instances: [],
  status: {},
};

export default global;
