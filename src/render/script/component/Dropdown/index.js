import React from 'react';
import style from './index.module.css';
import RegionListOffline from '~/render/script/component/RegionListOffline';
import { done, } from '~/render/script/lib/utils';
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
    this.data = [];
    this.dealBlur = this.dealBlur.bind(this);
    this.dealEvent = this.dealEvent.bind(this);
    this.transition = this.transition.bind(this);
    this.checkUl = this.checkUl.bind(this);
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

  checkUl() {
    const { id, } = this;
    const ul = document.getElementById(id);
    let ans = false;
    if (ul) {
      console.log(ul);
      ans = true;
      this.ul = ul;
    }
    return ans;
  }

  open() {
    this.setState({
      open: true,
      height: this.height,
    });
    done(this.checkUl, () => {
      const scrollTop = ul.scrollTop;
      const height = ul.clientHeight;
      const status = {
        first: 0,
        top: scrollTop,
        bottom: scrollTop + height,
        scrollTop: ul.scrollTop,
      };
      this.status = status;
      this.bindEvent();
    });
  }

  setData(data) {
    this.data = data;
    this.initLast();
    this.updateView('d');
  }

  syncInsert(i, t) {
    const e = this.data[i];
    if (e) {
      const { id, ul, } = this;
      const k = id + i;
      const component = <div className={style.item} key={i}>{e}</div>;
      let item;
      switch (i) {
        case 0:
          item = <li className={[style.item, style.firstItem].join(' ')} key={i}>{e}</li>;
          break;
        case data.length - 1:
          item = <li className={[style.item, style.lastItem].join(' ')} key={i}>{e}</li>;
          break;
        default:
          item = <li className={style.item} key={i}>{e}</li>;
          break;
      }
      const li = renderToNode(item);
      switch (t) {
        case 'd':
          ul.append(li);
          break;
        case 'u':
          ul.prepend(li);
          break;
      }
      const root = ReactDOM.createRoot(li);
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
