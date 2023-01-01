import Emitter from '~/render/script/class/Emitter';

const global = {
  emitter: new Emitter(),
  pkg: {},
  content: {
    index: {},
    contents: [],
  },
  component: {},
};

export default global;
