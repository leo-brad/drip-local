import Emitter from '~/render/script/class/Emitter';
import Location from '~/render/script/class/Location';

const emitter = new Emitter();
const location = new Location();

const global = {
  location,
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
