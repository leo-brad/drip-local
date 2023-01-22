import React from 'react';
import style from './index.module.css';
import OfflineComponent from '~/render/script/component/OfflineComponent';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
} = global;

function formatUnit(val) {
  return val + 'px';
}

class Dropdown extends OfflineComponent {
  constructor(props) {
    super(props);
    this.id = new Date().getTime().toString();
    this.state = {
      data: [],
      height: undefined,
      open: false,
    };
    this.dealBlur = this.dealBlur.bind(this);
    this.dealEvent = this.dealEvent.bind(this);
    this.transition = this.transition.bind(this);
  }

  ownDidMount() {
    const { id, } = this;
    const dom = document.getElementById(id);
    this.dom = dom;
  }

  dealBlur(e) {
    const parent = e.target.closest('ul');
    if (parent !== this.dom) {
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
        this.setState({
          data,
        });
        this.open();
        break;
      }
      case 'hidden': {
        this.setState({
          data,
        });
        this.close();
        break;
      }
    }
  }

  transition() {
    let { height, } = this.state;
    const { dom, } = this;
    if (height === undefined) {
      height = dom.offsetHeight;
      this.height = dom.offsetHeight;
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

  open() {
    const { height, } = this;
    this.setState({
      open: true,
      height: height,
    });
  }

  render() {
    const { id, } = this;
    const { data, height, } = this.state;
    const items = data.map((e, i) => {
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
      return item;
    });
    let list = null;
    const { open, } = this.state;
    if (open) {
      list = items;
    }
    return(
      <ul id={id} className={style.dropdown} style={{ height: formatUnit(height) }}>
        {list}
      </ul>
    );
  }
}

export default Dropdown;
