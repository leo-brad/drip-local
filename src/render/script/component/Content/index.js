import React from 'react';
import style from './index.module.css';
import OfflineComponent from '~/render/script/component/OfflineComponent';
import check from '~/render/script/lib/check';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
  component,
  pkg,
  content,
} = global;

class Content extends OfflineComponent {
  constructor(props) {
    super(props);
    const { instance, } = global;
    this.state = {
      instance,
    };
    this.id = new Date().getTime().toString();
    this.instance = instance;
    this.updateView = this.updateView.bind(this);
    this.dealEvent = this.dealEvent.bind(this);
    this.checkContent = this.checkContent.bind(this);
    this.syncInstance = this.syncInstance.bind(this);
  }

  async updateView() {
    const {
      share: {
        focus,
      },
    } = global;
    if (focus) {
      const { instance, } = global;
      this.setState({
        instance,
      });
      await this.sendMountAndUnmount();
    }
  }

  getDom() {
    const { dom, } = this;
    if (dom === undefined) {
      const { id, } = this;
      this.dom = document.getElementById(id);
    }
    return this.dom;
  }

  checkContent() {
    const dom = this.getDom();
    let ans = false;
    if (dom) {
      const content = dom.children[0];
      if (content) {
        const {
          instance,
        } = global;
        if (content.id.includes(instance)) {
          ans = true;
        }
      }
    }
    return ans;
  }

  dealEvent(data) {
    const [event] = data;
    switch (event) {
      case 'status/update':
        this.updateView();
        break;
    }
  }

  async sendMountAndUnmount() {
    const { instance: beforeInstance, } = this;
    if (beforeInstance) {
      let event = 'unmount';
      emitter.send(beforeInstance, [event]);
    }

    const dom = this.getDom();
    if (dom) {
      await check(this.checkContent);
    }

    const { instance, } = global;
    event = 'mount';
    emitter.send(instance, [event]);
    this.instance = instance;
  }

  syncInstance() {
    const { instance: beforeInstance, } = this;
    if (beforeInstance) {
      emitter.remove(beforeInstance, this.dealEvent);
    }
    const { instance, } = global;
    emitter.on(instance, this.dealEvent);
    this.instance = instance;
  }

  bind() {
    emitter.on('instance/add', this.syncInstance);
    emitter.on('instance/change', this.updateView);
    emitter.on('main/reset', this.updateView);
  }

  remove() {
    emitter.remove('instance/add', this.syncInstance);
    emitter.remove('instance/change', this.updateView);
    emitter.remove('main/reset', this.updateView);
  }

  render() {
    const { id, } = this;
    const {
      instance,
    } = this.state;
    const {
      content,
    } = global;
    const data = content[instance];
    if (Array.isArray(data) && data.length > 0) {
      if (!component[instance]) {
        const regexp = /^\[(\w+)\]:(\w+)$/;
        if (regexp.test(instance)) {
          const [_, i] = instance.match(regexp);
          const Pkg = pkg[i];
          const { share, } = global;
          component[instance] = <Pkg instance={instance} data={data} share={share} />;
        }
      }
    } else {
      component[instance] = null;
    }
    return(
      <div id={id} className={style.content}>{component[instance]}</div>
    );
  }
}

export default Content;
