import React from 'react';
import ReactDOM from 'react-dom/client';
import style from './index.module.css';
import PointLineOffline from '~/render/script/component/PointLineOffline';
import TabMiddleButton from '~/render/script/component/TabMiddleButton';
import TabEdgeButton from '~/render/script/component/TabEdgeButton';
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
    this.state = {
      left: undefined,
      right: undefined,
    };
    this.data = [];
    this.hasData = false;
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
    const { position, } = this;
    this.setPosition(position);
  }

  setPosition(position) {
    const { ul, } = this;
    for (const child of ul.children) {
      if (child.tagName === 'li') {
        child.remove();
      }
    }
    global.position = position;
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
    this.addEdgeButton();
  }

  addEdgeButton() {
    const { left, right, } = global;
    this.setState({
      left,
      right,
    });
  }

  addItem(t) {
    const { ul, id, } = this;
    const idx = this.getIndex();
    const d = this.data[idx];
    if (d !== undefined) {
      this.idx = idx;
      const id = this.getKey(idx);
      const component = <TabMiddleButton i={d} k={idx}>{d}</TabMiddleButton>;
      const node = renderToNode(<li id={id} />);
      switch (t) {
        case 2: {
          ul.append(node);
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
      this.renderElement(li, component);
      this.isUpdate = true;
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

  detectEdge() {
    let ans = false;;
    const { r, idx, li, isUpdate, } = this;
    if (idx !== undefined && isUpdate) {
      switch (r) {
        case 1: {
          const { right, } = global;
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
          const { left, }= global;
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

  renderElement(container, component) {
    if (container) {
      const root = ReactDOM.createRoot(container);
      root.render(component);
    }
  }

  render() {
    const { id, } = this;
    const { left, right, } = global;
    let l = null;
    if (left !== undefined) {
      if (left > 0) {
        l = <TabEdgeButton t="l" />
      }
    }
    let r = null;
    if (right !== undefined) {
      if (right < this.data.length - 1) {
        r = <TabEdgeButton t="r" />
      }
    }
    return(
      <ul id={id} className={style.buttonList}>
        {l}{r}
      </ul>
    );
  }
}

export default TabButtons;
