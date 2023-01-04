import React from 'react';
import OptimizeComponent from '~/render/script/component/OptimizeComponent';
import global from '~/render/script/obj/global';

const {
  emitter,
  component,
  pkg,
  content,
} = global;

class Content extends OptimizeComponent {
  constructor(props) {
    super(props);
    const { instance, } = global;
    this.state = {
      instance,
    };
    this.updateView = this.updateView.bind(this);
    this.dealEvent = this.dealEvent.bind(this);
    this.syncInstance = this.syncInstance.bind(this);
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

  dealEvent(data) {
    const [event] = data;
    switch (event) {
      case 'status/update':
        this.updateView();
        break;
    }
  }

  syncInstance() {
    setTimeout(() => {
      const { instance: beforeInstance, } = this;
      if (beforeInstance) {
        emitter.remove(beforeInstance, this.dealEvent);
      }
      const { instance, } = global;
      emitter.on(instance, this.dealEvent);
      this.instance = instance;
    }, 0);
  }

  bind() {
    emitter.on('instance/add', this.syncInstance);
    emitter.on('instance/change', this.syncInstance);
  }

  remove() {
    emitter.remove('instance/add', this.syncInstance);
    emitter.remove('instance/change', this.syncInstance);
  }

  render() {
    const {
      instance,
    } = this.state;
    let view = null;
    const {
      content,
    } = global;
    const data = content[instance];
    if (Array.isArray(data) && data.length > 0) {
      const regexp = /^\[(\w+)\]:(\w+)$/;
      if (regexp.test(instance)) {
        const [_, i] = instance.match(regexp);
        const Pkg = pkg[i];
        if (component[instance] === undefined) {
          component[instance] = <Pkg instance={instance} data={data} emitter={emitter} />
        }
        view = component[instance];
      }
    }
    return view;
  }
}

export default Content;
