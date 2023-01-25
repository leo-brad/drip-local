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

function getIndex(i) {
  const { type, } = global;
  let ans;
  switch (type) {
    case 'l': {
      const { left, } = global;
      ans = left - 1 - i;
      break;
    }
    case 'r': {
      const { right, } = global;
      ans = right + 1 + i;
    }
  }
  return ans;
}


class Dropdown extends RegionListOffline {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
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
        let { left, instances, } = global;
        if (left === undefined) {
          left = 0;
        }
        data = instances.slice(0, left);
        break;
      }
      case 'r': {
        let { right, instances, } = global;
        if (right === undefined) {
          right = instances.length - 2;
        }
        data = instances.slice(right + 1, instances.length);
        break;
      }
    }
    switch (event) {
      case 'show': {
        this.setData(data);
        const { open, } = this.state;
        if (open) {
          this.close();
        }
        this.open();
        break;
      }
      case 'hidden': {
        this.setData(data);
        const { open, } = this.state;
        if (!open) {
          this.open();
        }
        this.close();
        break;
      }
    }
  }

  async transition() {
    const { ul, } = this;
    let { height, } = this.state;
    if (height === 0) {
      if (ul) {
        check(this.checkUi);
        height = ul.clientHeight;
        this.height = height;
      }
    }
    const newHeight = height - this.height * 0.05;
    this.setState({
      height: newHeight,
    });
    if (newHeight > 0) {
      requestAnimationFrame(this.transition);
    } else {
      this.setState({
        open: false,
        height: 0,
      });
    }
  }

  async close() {
    await this.transition();
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
    const { data, } = this;
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
    ul.innerHTML = '';
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
      const index = parseInt(target.getAttribute('p'));
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
      const idx = id + i;
      let p = getIndex(i);
      let component;
      switch (i) {
        case 0:
          component =
          <li id={idx} p={p} className={[style.item, style.firstItem].join(' ')}>{e}</li>;
          break;
        case data.length - 1:
          component =
          <li id={idx} p={p} className={[style.item, style.lastItem].join(' ')}>{e}</li>;
          break;
        default:
          component =
          <li id={idx} p={p} className={style.item}>{e}</li>;
          break;
      }
      const li = renderToNode(component);
      switch (t) {
        case 'd':
          ul.append(li);
          break;
        case 'u':
          ul.prepend(li);
          break;
      }
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
