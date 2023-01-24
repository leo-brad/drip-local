import React from 'react';
import style from './index.module.css';
import ReactDOM from 'react-dom/client';
import RegionListOffline from '~/render/script/component/RegionListOffline';
import check from '~/render/script/lib/check';
import renderToNode from '~/render/script/lib/renderToNode';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
} = global;

function formatUnit(val) {
  return val + 'px';
}

class Dropdown extends RegionListOffline {
  constructor(props) {
    super(props);
    this.state = {
      height: undefined,
      open: false,
    };
    this.first = true;
    this.roots = {};
    this.data = [];
    this.onClick = this.onClick.bind(this);
    this.dealBlur = this.dealBlur.bind(this);
    this.dealEvent = this.dealEvent.bind(this);
    this.transition = this.transition.bind(this);
    this.checkUi = this.checkUi.bind(this);
  }

  ownDidMount() {
    const { id, } = this;
    const ul = document.getElementById(id);
    this.ul = ul;
  }

  dealBlur(e) {
    const parent = e.target.closest('ul');
    if (parent !== this.ul) {
      emitter.send('dropdown', ['blur']);
      e.preventDefault();
      e.stopPropagation();
      this.close();
    }
  }

  bind() {
    document.addEventListener('click', this.dealBlur);
    emitter.on('dropdown', this.dealEvent);
  }

  remove() {
    document.removeEventListener('click', this.dealBlur);
    emitter.remove('dropdown', this.dealEvent);
    this.removeEvent();
    const { ul, } = this;
    if (ul) {
      ul.removeEventListener('click', this.onClick);
    }
  }

  dealEvent([event, t]) {
    let data;
    switch (t) {
      case 'l': {
        const { left, instances, } = global;
        data = instances.slice(0, left);
        break;
      }
      case 'r': {
        const { right, instances, } = global;
        data = instances.slice(right + 1, instances.length);
        break;
      }
    }
    switch (event) {
      case 'show': {
        this.setData(data);
        this.open();
        break;
      }
      case 'hidden': {
        this.setData(data);
        this.close();
        break;
      }
    }
  }

  transition() {
    let { height, } = this.state;
    const { ul, } = this;
    if (height === undefined) {
      height = ul.offsetHeight;
      this.height = ul.offsetHeight;
    }
    const newHeight = height - 4;
    this.setState({
      height: newHeight,
    });
    if (newHeight > 0) {
      window.requestAnimationFrame(this.transition);
    } else {
      this.setState({
        open: false,
      });
    }
  }

  close() {
    this.transition();
  }

  checkUi() {
    const { id, } = this;
    const ul = document.getElementById(id);
    let ans = false;
    if (ul) {
      ans = true;
      this.ul = ul;
    }
    return ans;
  }

  async open() {
    this.setState({
      open: true,
    });
    await check(this.checkUi);
    const { ul, } = this;
    ul.style.height = 'auto';
    this.init();
    const { first, } = this;
    if (first) {
      this.bindEvent();
      this.first = false;
    }
  }

  init() {
    const { ul, } = this;
    ul.addEventListener('click', this.onClick);
    const scrollTop = ul.scrollTop;
    const height = ul.clientHeight;
    const status = {
      first: 0,
      top: scrollTop,
      bottom: scrollTop + height,
      scrollTop: ul.scrollTop,
    };
    this.status = status;
    this.initLast();
    this.updateView('d');
  }

  setData(data) {
    this.data = data;
  }

  onClick(e) {
    const { target, } = e;
    if (target.tagName === 'li'.toUpperCase()) {
      const k = target.getAttribute('k');
      const { type, } = global;
      let index;
      switch (type) {
        case 'l':
          index =  parseInt(k);
          break;
        case 'r': {
          const { right, } = global;
          index = right + 1 + parseInt(k);
          break;
        }
      }
      emitter.send('position/change', index);
      emitter.send('dropdown', ['click']);
      const { instances, } = global;
      emitter.send('instance/change', instances[index]);
      this.close();
    }
    e.preventDefault();
    e.stopPropagation();
  }

  syncInsert(i, t) {
    const e = this.data[i];
    if (e) {
      const { id, ul, data, } = this;
      const k = id + i;
      const div = <div id={k} key={i}>{e}</div>;
      const item = renderToNode(div);
      let component;
      switch (i) {
        case 0:
          component = <li className={[style.item, style.firstItem].join(' ')} k={i}>{e}</li>;
          break;
        case data.length - 1:
          component = <li className={[style.item, style.lastItem].join(' ')} k={i}>{e}</li>;
          break;
        default:
          component = <li className={style.item} k={i}>{e}</li>;
          break;
      }
      switch (t) {
        case 'd':
          ul.append(item);
          break;
        case 'u':
          ul.prepend(item);
          break;
      }
      this.renderElement(item, component, k);
    }
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
    const { height, open, } = this.state;
    let list = null;
    if (open) {
      list = <ul id={id} className={style.dropdown} style={{ height: formatUnit(height) }} />;
    }
    return list;
  }
}

export default Dropdown;
