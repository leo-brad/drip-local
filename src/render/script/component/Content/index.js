import React from 'react';
import ReactDOM from 'react-dom/client';
import style from './index.module.css';
import OfflineResize from '~/render/script/component/OfflineResize';
import renderToNode from '~/render/script/lib/renderToNode';
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

class Content extends OfflineResize {
  constructor(props) {
    super(props);
    const { instance, } = global;
    this.state = {
      instance,
    };
    this.roots = {};
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
      this.setInstance(instance);
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
      const div = dom.children[0];
      const {
        instance,
      } = global;
      if (div && div.id === instance) {
        const content = div.children[0];
        if (content) {
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

  resize() {
    const {
      instance,
    } = global;
    this.setInstance(instance);
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

  setInstance(instance) {
    this.renderElement(this.getComponent(instance), instance);
  }

  getComponent(instance) {
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
    return component[instance];
  }

  renderElement(component, instance) {
    const dom = this.getDom();
    if (dom) {
      const node = renderToNode(<div id={instance} />);
      dom.innerHTML = '<div id="' + instance + '" style="height: 100%" />';
      const div = document.getElementById(instance);
      const root = ReactDOM.createRoot(div);
      root.render(component);
      this.roots[instance] = root;
    }
  }

  render() {
    const { id, } = this;
    return <div id={id} className={style.content} />;
  }
}

export default Content;
