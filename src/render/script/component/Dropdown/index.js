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
    this.dealEvent = this.dealEvent.bind(this);
    this.transition = this.transition.bind(this);
  }

  ownDidMount() {
    const { id, } = this;
    const dom = document.getElementById(id);
    this.dom = dom;
  }

  bind() {
    emitter.on('dropdown', this.dealEvent);
  }

  remove() {
    emitter.remove('dropdown', this.dealEvent);
  }

  dealEvent([event, t]) {
    let open;
    switch (event) {
      case 'show': {
        open = true;
        break;
      }
      case 'hidden': {
        open = false;
        break;
      }
    }
    switch (t) {
      case 'l': {
        const { left, instances, } = global;
        this.setState({
          open,
          data: instances.slice(0, left),
        });
        break;
      }
      case 'r': {
        const { right, instances, } = global;
        this.setState({
          open,
          data: instances.slice(right + 1, instances.length),
        });
        break;
      }
    }
  }

  transition() {
    let { height, } = this.state;
    const { dom, } = this;
    if (height === undefined) {
      height = dom.offsetHeight;
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
      list =
        <ul id={id} className={style.dropdown} style={{ height: formatUnit(height) }}>
          {items}
        </ul>;
    }
    return list;
  }
}

export default Dropdown;
