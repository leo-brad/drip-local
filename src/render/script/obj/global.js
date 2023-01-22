import Emitter from '~/render/script/class/Emitter';
import Location from '~/render/script/class/Location';

const emitter = new Emitter();
const location = new Location();

const global = {
  type: 'r',
  left: undefined,
  right: undefined,
  position: 0,
  location,
  error: null,
  router: null,
  template: null,
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
