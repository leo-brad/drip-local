import React from 'react';
import check from '~/render/script/lib/check';
import OfflineComponent from '~/render/script/component/OfflineComponent';

class PointLineOffline extends OfflineComponent {
  constructor(props) {
    super(props);
    this.isUpdate = false;
    this.widths = {};
    this.doms = {};
    this.id = new Date().getTime().toString();
    this.position = 0;
    this.checkDom = this.checkDom.bind(this);
  }

  checkDom(key) {
    const dom = document.getElementById(key);
    let ans = false;
    if (dom !== null) {
      ans = true;
    }
    return ans;
  }

  async getDom(key) {
    const { doms, } = this;
    if (doms[key] === undefined) {
      await check(() => this.checkDom(key));
      doms[key] = document.getElementById(key);
    }
    return doms[key];
  }

  async getWidth(key) {
    const { widths, } = this;
    if (widths[key] === undefined) {
      const dom = await this.getDom(key);
      if (dom) {
        widths[key] = dom.clientWidth;
      }
    }
    return widths[key];
  }

  async getLeft(key) {
    const dom = await this.getDom(key);
    if (dom) {
      return dom.offsetLeft;
    }
  }

  async getRight(key) {
    const width = await this.getWidth(key);
    const left = await this.getLeft(key);
    return left + width;
  }

  getKey(key) {
    const { id, } = this;
    return id + key;
  }
}

export default PointLineOffline;
