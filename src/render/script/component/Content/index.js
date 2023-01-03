import React from 'react';
import global from '~/render/script/obj/global';

const {
  emitter,
  component,
  pkg,
  contents,
} = global;

class Content extends React.Component {
  constructor(props) {
    super(props);
    const { instance, index, } = global;
    this.state = {
      index,
      instance,
    };
    emitter.on(instance, this.updateView);
    this.updateView = this.updateView.bind(this);
  }

  updateView() {
    const { instance: beforeInstance, } = this.state;
    emitter.remove(beforeInstance, this.updateView);
    const { instance, } = global;
    console.log('bind');
    emitter.on(instance, this.updateView);
    if (focus) {
      setTimeout(() => {
        const { index, instance, } = global;
        this.setState({
          index,
          instance,
        });
      }, 0);
    }
  }

  componentDidMount() {
    emitter.on('instance/add', this.updateView);
    //emitter.on('instance/reduce', this.updateView);
  }

  componentWillUnmount() {
    emitter.remove('instance/add', this.updateView);
    //emitter.remove('instance/reduce', this.updateView);
  }

  render() {
    const {
      index,
      instance,
    } = this.state;
    let content = null;
    //console.log('index', index);
    //console.log('instance', instance);
    const idx = index[instance];
    //console.log(idx);
    if (typeof idx === 'number') {
      if (!Array.isArray(contents[idx])) {
        contents[idx] = [];
      }
      const data = contents[idx];
      const regexp = /^\[(\w+)\]:(\w+)$/;
      if (regexp.test(instance)) {
        const [_, i] = instance.match(regexp);
        const Pkg = pkg[i];
        if (component[instance] === undefined) {
          component[instance] = <Pkg instance={instance} data={data} emitter={emitter} />
        }
        content = component[instance];
      }
    }
    return content;
  }
}

export default Content;
