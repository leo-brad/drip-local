import React from 'react';
import OfflineComponent from '~/render/script/component/OfflineComponent';

class PointLine extends React.Component {
  constructor(props) {
    super(props);
    const { data, } = this.props;
    this.isUpdate = false;
    this.widths = {};
    this.doms = {};
    this.id = new Date().getTime().toString();
  }

  componentDidMount() {
    const { id, } = this;
    const ul = document.getElementById(id);
    this.ul = ul;
    this.width = ul.clientWidth;
    this.setPosition(0);
  }

  setPosition(position) {
    const { ul, } = this;
    for (const child of ul.children) {
      child.remove();
    }
    this.position = position;
    this.count = 0;
    this.addItem(2);
    this.count += 1;
    ul.style.visibility = 'hidden';
    while (true) {
      const { count, } = this;
      this.r = count % 2;
      const { r, } = this;
      if (count > this.props.data.length - 1) {
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
}

export default PointLine;
