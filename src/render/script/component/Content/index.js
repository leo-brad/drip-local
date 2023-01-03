import React from 'react';
import global from '~/render/script/obj/global';

const {
  emitter,
  component,
  pkg,
  content: {
    index,
    contents,
  },
} = global;

function getData(instance) {
  const idx = index[instance];
  let data;
  if (contents[idx]) {
    data = contents[idx];
  } else {
    data = [];
  }
  return data;
}

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instance: '',
    };
    this.updateView = this.updateView.bind(this);
  }

  updateView() {
    if (focus) {
      setTimeout(() => {
        const { instance, } = global;
        this.setState({
          instance,
        });
      }, 0);
    }
  }

  componentDidMount() {
    emitter.on('instance/add', this.updateView);
    emitter.on('instance/reduce', this.updateView);
  }

  componentWillUnmount() {
    emitter.remove('instance/add', this.updateView);
    emitter.remove('instance/reduce', this.updateView);
  }

  render() {
    const {
      instance,
    } = this.state;
    if (component[instance] === undefined) {
      const regexp = /^\[(\w+)\]:(\w+)$/;
      if (regexp.test(instance)) {
        const data = getData(instance);
        const [_, i] = instance.match(regexp);
        const Pkg = pkg[i];
        component[instance] = <Pkg instance={instance} data={data} emitter={emitter} />
      } else {
        component[instance] = null;
      }
    }
    return component[instance];
  }
}

export default Content;
