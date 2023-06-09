import React from 'react';
import ReactDOM from 'react-dom/client';
import style from './index.module.css';
import PointLineOfflineResize from '~/render/script/component/PointLineOfflineResize';
import TabMiddleButton from '~/render/script/component/TabMiddleButton';
import TabEdgeButton from '~/render/script/component/TabEdgeButton';
import check from '~/render/script/lib/check';
import formateUnit from '~/render/script/lib/formateUnit';
import renderToNode from '~/render/script/lib/renderToNode';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
  instances,
} = global;

class TabButtons extends PointLineOfflineResize {
  constructor(props) {
    super(props);
    const { id, } = this;
    this.empty = 0;
    this.data = [];
    this.roots = {};
    this.flag = true;
    this.hasData = false;
    this.position = 0;
    this.step = this.step.bind(this);
    this.checkButtons = this.checkButtons.bind(this);
    this.checkEmpty = this.checkEmpty.bind(this);
    this.checkEdgeButton = this.checkEdgeButton.bind(this);
    this.updateView = this.updateView.bind(this);
    this.positionChange = this.positionChange.bind(this);
  }

  ownDidMount() {
    const { id, } = this;
    const ul = document.getElementById(id);
    this.ul = ul;
    this.right = ul.clientWidth - 23;
    this.left = 0;
  }

  async positionChange(p) {
    await this.setPosition(p);
    this.position = p;
  }

  async resize() {
    let dw = 0;
    if (this.w) {
      this.w = window.clientWidth;
    } else {
      const { w, } = this;
      dw = window.clientWidth - w;
    }
    if (Math.abs(dw) > 0) {
      const { flag, } = this;
      if (flag) {
        this.flag = false;
        setTimeout(async () => {
          this.flag = true;
        }, 100);
        await this.resizeComponent();
      } else {
        this.dirty = true;
        setTimeout(async () => {
          const { dirty, } = this;
          if (dirty) {
            await this.resizeComponent();
            this.dirty = false;
          }
        }, 250);
      }
    }
  }

  async resizeComponent() {
    const { ul, position, } = this;
    this.right = ul.clientWidth - 23;
    await this.setPosition(position);
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
    const { id, ul, } = this;
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

  checkEdgeButton() {
    const { ul, } = this;
    let ans = false;
    if (ul) {
      let time = 0;
      for (let li of ul.children) {
        const id = li.id;
        if (id.includes('l') || id.includes('r')) {
          ans = true;
        }
      }
    }
    return ans;
  }

  async setPosition(position) {
    const { ul, } = this;
    ul.style.visibility = 'hidden';
    ul.innerHTML = '';
    this.clean();
    global.position = position;
    this.type = 0;
    this.num = 0;
    this.count = 0;
    this.addItem(2);
    this.count += 1;
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
    await this.addEdgeButton();
    this.transition();
  }

  step() {
    const { begin, } = this;
    if (begin) {
      this.opacity = 0;
    } else {
      this.opacity += 13;
    }
    const { opacity, } = this;
    if (opacity < 100) {
      const { ul, } = this;
      ul.style.opacity = formateUnit(this.opacity, '%');
      window.requestAnimationFrame(this.step);
    } else {
      const { ul, } = this;
      ul.style.opacity = null;
    }
    if (begin) {
      const { ul, } = this;
      ul.style.visibility = 'visible';
      this.begin = false;
    }
  }

  transition() {
    const { ul, } = this;
    this.begin = true;
    window.requestAnimationFrame(this.step);
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

  async addEdgeButton() {
    const { ul, } = this;
    for (const child of ul.children) {
      const id = child.id;
      if (id.includes('l') || id.includes('r')) {
        child.remove();
      }
    }
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
    if (types.length > 0) {
      await check(this.checkEdgeButton);
    }
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

  async getRight(key) {
    const width = await this.getWidth(key);
    const left = await this.getLeft(key);
    const { num, } = this;
    return left + width - num;
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
            if (right > this.right || right <= 0) {
              ans = true;
              const { li, } = this;
              if (li) {
                li.remove();
                this.num -= 1;
                global.right = this.idx - 1;
              }
            }
          }
          break;
        }
        case 0: {
          const { left, }= global;
          if (left !== undefined) {
            const left = await this.getLeft(this.key);
            if (left < this.left || left <= 0) {
              ans = true;
              const { li, } = this;
              if (li) {
                li.remove();
                this.num -= 1;
                global.left = this.idx + 1;
              }
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
