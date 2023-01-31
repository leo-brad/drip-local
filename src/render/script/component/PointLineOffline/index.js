import React from 'react';
import check from '~/render/script/lib/check';
import Offline from '~/render/script/component/Offline';

class PointLineOffline extends Offline {
  constructor(props) {
    super(props);
    this.isUpdate = false;
    this.widths = {};
    this.doms = {};
    this.id = new Date().getTime().toString();
    this.position = 0;
    this.checkDom = this.checkDom.bind(this);
    this.checkButton = this.checkButton.bind(this);
  }

  clean() {
    this.widths = {};
    this.doms = {};
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

  checkButton(li) {
    const button = li.children[0];
    let ans = false;
    if (button && button.tagName === 'button'.toUpperCase()) {
      ans = true;
    }
    return ans;
  }

  async getWidth(key) {
    const { widths, } = this;
    if (widths[key] === undefined) {
      const dom = await this.getDom(key);
      if (dom) {
        await check(() => this.checkButton(dom));
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
    return left + width / 2;
  }

  getKey(key) {
    const { id, } = this;
    return id + key;
  }

  setType(t) {
    const { type, } = this;
    switch (t) {
      case 'l': {
        if (Math.floor(type / 2) !== 1) {
          this.type += 2;
        }
        break;
      }
      case 'r': {
        if (type % 2 !== 1) {
          this.type += 1;
        }
        break;
      }
    }
  }
}

export default PointLineOffline;
