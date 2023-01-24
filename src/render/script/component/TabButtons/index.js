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
    this.updateView = this.updateView.bind(this);
    this.positionChange = this.positionChange.bind(this);
  }

  ownDidMount() {
    const { id, } = this;
    const ul = document.getElementById(id);
    this.ul = ul;
    this.width = ul.clientWidth;
  }

  positionChange(k) {
    this.setPosition(k);
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

  setData(data) {
    if (data.length !== 0) {
      const { hasData, } = this;
      if (!hasData) {
        this.data = data;
        this.hasData = true;
      }
    }
    const { position, } = this;
    this.setPosition(position);
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
    for (const child of ul.children) {
      if (child.tagName === 'li'.toUpperCase()) {
        child.remove();
      }
    }
    global.position = position;
    this.num = 0;
    this.count = 0;
    this.addItem(2);
    this.count += 1;
    ul.style.visibility = 'hidden';
    while (true) {
      const { count, } = this;
      this.r = count % 2;
      const { r, } = this;
      if (count > this.data.length - 1) {
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
    let component = null;
    let type;
    if (left !== undefined) {
      if (left > 0) {
        component = <TabEdgeButton t="l" />;
        type = 'l';
      }
    }
    if (right !== undefined) {
      if (right < this.data.length - 1) {
        component = <TabEdgeButton t="r" />;
        type = 'r';
      }
    }
    if (component !== null) {
      const id = this.id + type;
      const node = renderToNode(<li id={id} />);
      switch (type) {
        case 'l':
          ul.prepend(node);
          break;
        case 'r':
          ul.append(node);
          break;
      }
      const li = document.getElementById(id);
      this.renderElement(li, component, id);
    }
  }

  addItem(t) {
    const { ul, id, } = this;
    const idx = this.getIndex();
    const d = this.data[idx];
    if (d !== undefined) {
      this.idx = idx;
      const id = this.getKey(idx);
      this.key = id;
      const component = <TabMiddleButton i={d} k={idx}>{d}</TabMiddleButton>;
      const node = renderToNode(<li id={id} />);
      switch (t) {
        case 2: {
          global.left = undefined;
          global.right = undefined;
          ul.append(node);
          break;
        }
        case 1: {
          ul.append(node);
          global.left = undefined;
          global.right = idx;
          break;
        }
        case 0: {
          ul.prepend(node);
          global.left = idx;
          global.right = undefined;
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

  getIndex() {
    const { position, } = global;
    const { count, r, } = this;
    const time = Math.floor(count / 2) + 1;
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
    const { r, idx, li, isUpdate, } = this;
    if (idx !== undefined && isUpdate) {
      switch (r) {
        case 1: {
          const { right, } = global;
          if (right !== undefined) {
            const right = await this.getRight(this.key);
            console.log('right', right);
            console.log('this.width', this.width);
            if (right > this.width) {
              ans = true;
              li.remove();
            }
          }
          break;
        }
        case 0: {
          const { left, }= global;
          if (left !== undefined) {
            const left = await this.getLeft(this.key);
            if (left < 0) {
              ans = true;
              li.remove();
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
