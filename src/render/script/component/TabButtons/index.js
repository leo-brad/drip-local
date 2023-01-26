import React from 'react';
import ReactDOM from 'react-dom/client';
import style from './index.module.css';
import PointLineOffline from '~/render/script/component/PointLineOffline';
import TabMiddleButton from '~/render/script/component/TabMiddleButton';
import TabEdgeButton from '~/render/script/component/TabEdgeButton';
import check from '~/render/script/lib/check';
import renderToNode from '~/render/script/lib/renderToNode';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
  instances,
} = global;

class TabButtons extends PointLineOffline {
  constructor(props) {
    super(props);
    const { id, } = this;
    this.empty = 0;
    this.data = [];
    this.roots = {};
    this.hasData = false;
    this.checkButtons = this.checkButtons.bind(this);
    this.checkEmpty = this.checkEmpty.bind(this);
    this.updateView = this.updateView.bind(this);
    this.positionChange = this.positionChange.bind(this);
  }

  ownDidMount() {
    const { id, } = this;
    const ul = document.getElementById(id);
    this.ul = ul;
    this.width = ul.offsetWidth - 22;
    this.left = ul.offsetLeft;
  }

  async positionChange(k) {
    await this.setPosition(k);
  }

  bind() {
    emitter.on('main/reset', this.updateView);
    emitter.on('instance/add', this.updateView);
    emitter.on('instance/reduce', this.updateView);
    emitter.on('position/change', this.positionChange);
  }

  remove() {
    emitter.remove('main/reset', this.updateView);
    emitter.remove('instance/add', this.updateView);
    emitter.remove('instance/reduce', this.updateView);
    emitter.remove('position/change', this.positionChange);
  }

  updateView(data) {
    const {
      share: {
        focus,
      },
    } = global;
    if (focus) {
      const { instances, } = global;
      this.setData(instances);
    }
  }

  async setData(data) {
    if (data.length !== 0) {
      const { hasData, } = this;
      if (!hasData) {
        this.data = data;
        this.hasData = true;
      }
    }
    const { position, } = this;
    await this.setPosition(position);
  }

  checkEmpty() {
    const { ul, } = this;
    return ul.children.length === 0;
  }

  checkButtons() {
    const { id, } = this;
    const ul = document.getElementById(id);
    let ans = false;
    if (ul) {
      let time = 0;
      for (let li of ul.children) {
        const child = li.children[0];
        if (child) {
          if (child.tagName === 'button'.toUpperCase()) {
            time += 1;
            const { num, } = this;
            if (time === num) {
              ans = true;
              break;
            }
          }
        }
      }
    }
    return ans;
  }

  async setPosition(position) {
    const { ul, } = this;
    ul.innerHTML = '';
    this.clean();
    global.position = position;
    this.type = 0;
    this.num = 0;
    this.count = 0;
    this.addItem(2);
    this.count += 1;
    ul.style.visibility = 'hidden';
    while (true) {
      const { count, } = this;
      this.r = count % 2;
      const { r, } = this;
      const { num, } = this;
      if (num > this.data.length - 1) {
        break;
      }
      if (this.type === 3) {
        break;
      }
      this.addItem(r);
      const flag = await this.detectEdge();
      if (flag) {
        break;
      }
      this.count += 1;
    }
    await check(this.checkButtons);
    this.clearEmpty();
    this.addEdgeButton();
    ul.style.visibility = 'visible';
  }

  clearEmpty() {
    const { ul, } = this;
    for (const child of ul.children) {
      if (child.tagName === 'li'.toUpperCase()) {
        const button = child.children[0];
        if (button === undefined) {
          child.remove();
        }
      }
    }
  }

  addEdgeButton() {
    const { ul, } = this;
    const { left, right, } = global;
    const types = [];
    const components = [];
    if (left !== undefined) {
      if (left > 0) {
        components[0] = <TabEdgeButton t="l" />;
        types.push('l');
      }
    }
    let r = null;
    if (right !== undefined) {
      if (right < this.data.length - 1) {
        components[1] = <TabEdgeButton t="r" />;
        types.push('r');
      }
    }
    types.forEach((t) => {
      const id = this.id + t;
      const dom = document.getElementById(id);
      if (dom) {
        dom.remove();
      }
      const node = renderToNode(<li id={id} />);
      switch (t) {
        case 'l': {
          ul.prepend(node);
          const li = document.getElementById(id);
          const [l] = components;
          this.renderElement(li, l, id);
          break;
        }
        case 'r': {
          ul.append(node);
          const li = document.getElementById(id);
          const [_, r] = components;
          this.renderElement(li, r, id);
          break;
        }
      }
    });
  }

  addItem(t) {
    const { ul, id, } = this;
    const idx = this.getIndex();
    if (idx >= 0 && idx < this.data.length) {
      const d = this.data[idx];
      if (idx < 0) {
        this.setType('l');
      }
      if (idx > this.data.length - 1) {
        this.setType('r');
      }
      if (d !== undefined) {
        this.idx = idx;
        const id = this.getKey(idx);
        this.key = id;
        const component = <TabMiddleButton i={d} k={idx}>{d}</TabMiddleButton>;
        const node = renderToNode(<li id={id} />);
        switch (t) {
          case 2: {
            ul.append(node);
            global.left = undefined;
            global.right = undefined;
            break;
          }
          case 1: {
            ul.append(node);
            global.right = idx;
            break;
          }
          case 0: {
            ul.prepend(node);
            global.left = idx;
            break;
          }
        }
        this.li = document.getElementById(id);
        const { li, } = this;
        this.renderElement(li, component, id);
        this.isUpdate = true;
        this.num += 1;
      } else {
        this.isUpdate = false;
      }
    }
  }

  getIndex() {
    const { position, } = global;
    const { count, r, } = this;
    const time = Math.floor((count - 1) / 2) + 1;
    let ans;
    if (count === 0) {
      ans = position;
    } else {
      switch (r) {
        case 0:
          ans = position - time;
          break;
        case 1:
          ans = position + time;
          break;
      }
    }
    return ans;
  }

  async detectEdge() {
    let ans = false;;
    const { r, idx, isUpdate, } = this;
    if (idx !== undefined && isUpdate) {
      switch (r) {
        case 1: {
          const { right, } = global;
          if (right !== undefined) {
            const right = await this.getRight(this.key);
            if (right > this.width || right === 0) {
              ans = true;
              const { li, } = this;
              li.remove();
              this.num -= 1;
              global.right = this.idx - 1;
            }
          }
          break;
        }
        case 0: {
          const { left, }= global;
          if (left !== undefined) {
            const left = await this.getLeft(this.key);
            if (left < this.left || left === 0) {
              ans = true;
              const { li, } = this;
              li.remove();
              this.num -= 1;
              global.left = this.idx + 1;
            }
          }
          break;
        }
      }
    }
    return ans;
  }

  renderElement(container, component, id) {
    if (container) {
      const { roots, } = this;
      let root;
      if (roots[id] === undefined) {
        root = ReactDOM.createRoot(container);
      } else {
        root = roots[id];
      }
      root.render(component);
    }
  }

  render() {
    const { id, } = this;
    return(
      <ul id={id} className={style.buttonList} />
    );
  }
}

export default TabButtons;
