import React from 'react';
import ReactDOM from 'react-dom/client';
import style from './index.module.css';
import OfflineComponent from '~/render/script/component/OfflineComponent';
import TabButton from '~/render/script/component/TabButton';
import renderToNode from '~/render/script/lib/renderToNode';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
  instances,
} = global;

class TabButtons extends OfflineComponent {
  constructor(props) {
    super(props);
    this.data = [];
    this.isUpdate = false;
    this.widths = {};
    this.doms = {};
    this.component = {};
    this.hasData = false;
    this.location = 0;
    this.id = new Date().getTime().toString();
    this.updateView = this.updateView.bind(this);
  }

  ownDidMount() {
    const { id, } = this;
    const ul = document.getElementById(id);
    this.ul = ul;
    this.width = ul.clientWidth;
  }

  bind() {
    emitter.on('main/reset', this.updateView);
    emitter.on('instance/add', this.updateView);
    emitter.on('instance/reduce', this.updateView);
  }

  remove() {
    emitter.remove('main/reset', this.updateView);
    emitter.remove('instance/add', this.updateView);
    emitter.remove('instance/reduce', this.updateView);
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
    const { location, } = this;
    this.setLocation(location);
  }

  setLocation(location) {
    const { ul, } = this;
    for (const child of ul.children) {
      child.remove();
    }
    this.location = location;
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
      if (this.detectEdge()) {
        break;
      }
      this.count += 1;
    }
    ul.style.visibility = 'visible';
  }

  getDom(key) {
    const { doms, } = this;
    if (doms[key] === undefined) {
      doms[key] = document.getElementById(key);
    }
    return doms[key];
  }

  getWidth(key) {
    const { widths, } = this;
    if (widths[key] === undefined) {
      const dom = this.getDom(key);
      if (dom) {
        widths[key] = dom.clientWidth;
      }
    }
    return widths[key];
  }

  getLeft(key) {
    const dom = this.getDom(key);
    if (dom) {
      return dom.offsetLeft;
    }
  }

  getRight(key) {
    const width = this.getWidth(key);
    const left = this.getLeft(key);
    return left + width;
  }

  getKey(key) {
    const { id, } = this;
    return id + key;
  }

  detectEdge() {
    let ans = false;;
    const { r, idx, li, isUpdate, } = this;
    if (idx !== undefined && isUpdate) {
      switch (r) {
        case 1: {
          const { right, } = this;
          if (right !== undefined) {
            const right = this.getRight(this.getKey(idx));
            if (right > this.width) {
              ans = true;
              li.remove();
            }
          }
          break;
        }
        case 0: {
          if (left !== undefined) {
            const left = this.getLeft(this.getKey(idx));
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

  getIndex() {
    const { count, r, location, } = this;
    const time = Math.floor(count / 2) + 1;
    let ans;
    if (count === 0) {
      ans = location;
    } else {
      switch (r) {
        case 0:
          ans = location - time;
          break;
        case 1:
          ans = location + time;
          break;
      }
    }
    return ans;
  }

  addItem(t) {
    const { ul, id, } = this;
    const idx = this.getIndex();
    const d = this.data[idx];
    if (d !== undefined) {
      this.idx = idx;
      const id = this.getKey(idx);
      const component = <TabButton i={d} k={idx}>{d}</TabButton>;
      const node = renderToNode(<li id={id} />);
      switch (t) {
        case 2: {
          ul.append(node);
          break;
        }
        case 1: {
          ul.append(node);
          this.right = idx;
          break;
        }
        case 0: {
          ul.prepend(node);
          this.left = idx;
          break;
        }
      }
      this.li = document.getElementById(id);
      const { li, } = this;
      if (li) {
        const root = ReactDOM.createRoot(li);
        root.render(component);
      }
      this.isUpdate = true;
    } else {
      this.isUpdate = false;
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
