import React from 'react';
import OfflineComponent from '~/render/script/component/OfflineComponent';

class PointLineOffline extends OfflineComponent {
  constructor(props) {
    super(props);
    this.isUpdate = false;
    this.widths = {};
    this.doms = {};
    this.id = new Date().getTime().toString();
    this.position = 0;
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
    const width = this.getWidth();
    const left = this.getLeft(key);
    return left + width;
  }

  getKey(key) {
    const { id, } = this;
    return id + key;
  }
}

export default PointLineOffline;
