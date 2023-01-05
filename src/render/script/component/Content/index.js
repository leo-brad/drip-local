import React from 'react';
import OptimizeComponent from '~/render/script/component/OptimizeComponent';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
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
    this.instance = instance;
    this.updateView = this.updateView.bind(this);
    this.dealEvent = this.dealEvent.bind(this);
    this.syncInstance = this.syncInstance.bind(this);
  }

  updateView() {
    const {
      share: {
        focus,
      },
    } = global;
    if (focus) {
      setTimeout(() => {
        const { instance, } = global;
        this.setState({
          instance,
        });
        this.sendMountAndUnmount();
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

  sendMountAndUnmount() {
    const { instance: beforeInstance, } = this;
    if (beforeInstance) {
      let event = 'unmount';
      emitter.send(beforeInstance, [event]);
    }
    const { instance, } = global;
    event = 'mount';
    emitter.send(instance, [event]);
    this.instance = instance;
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
    emitter.on('instance/change', this.updateView);
  }

  remove() {
    emitter.remove('instance/add', this.syncInstance);
    emitter.remove('instance/change', this.updateView);
  }

  render() {
    const {
      instance,
    } = this.state;
    const {
      content,
    } = global;
    const data = content[instance];
    if (Array.isArray(data) && data.length > 0) {
      if (component[instance] === undefined) {
        const regexp = /^\[(\w+)\]:(\w+)$/;
        if (regexp.test(instance)) {
          const [_, i] = instance.match(regexp);
          const Pkg = pkg[i];
          const { share, } = global;
          component[instance] = <Pkg instance={instance} data={data} share={share} />
        }
      }
    } else {
      component[instance] = null;
    }
    return component[instance];
  }
}

export default Content;
