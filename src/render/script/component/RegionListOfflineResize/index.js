import React from 'react';
import OfflineResize from '~/render/script/component/OfflineResize';

class RegionListOffline extends OfflineResize {
  constructor(props) {
    super(props);

    const id = new Date().getTime().toString();
    this.id = id;

    this.doms = [];
    this.heights = [];
    this.bindEvent = this.bindEvent.bind(this);
  }

  async dealScroll(e) {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000 / 29);
    });
    const {
      status: {
        scrollTop,
      },
      id,
    } = this;
    if (ul.scrollTop > scrollTop) {
      this.updateView('d');
      if (this.status.first >= 0) {
        this.syncRemove('d');
      }
    } else if (ul.scrollTop < scrollTop) {
      const {
        status: {
          last,
        }
      } = this;
      this.updateView('u');
      if (last < this.data.length) {
        this.syncRemove('u');
      }
    }
    this.status.scrollTop = ul.scrollTop;
  }

  bindEvent() {
    const { ul, } = this;
    ul.addEventListener('scroll', this.dealScroll);
  }

  removeEvent() {
    const { ul, } = this;
    if (ul) {
      ul.removeEventListener('scroll', this.dealScroll);
    }
  }

  updateView(t) {
    switch (t) {
      case 'd':
        this.downView();
        break;
      case 'u':
        this.upView();
        break;
    }
  }

  getDom(key) {
    const { id, doms, } = this;
    if (doms[key] === undefined) {
      doms[key] = document.getElementById(key);
    }
    return doms[key];
  }

  getHeight(dom, key) {
    const { heights, } = this;
    if (heights[key] === undefined) {
      heights[key] = dom.clientHeight;
    }
    return heights[key];
  }

  initLast() {
    const { top, bottom, } = this.status;
    this.syncInsert(0, 'd');
    this.status.last = 0;
  }

  getKey(k) {
    const { id, } = this;
    return id + k;
  }

  getDomUpTop(key) {
    const dom = this.getDom(key);
    const top = dom.offsetTop;
    return top;
  }

  getDomUpBottom(key) {
    const top = this.getDomUpTop(key);
    const dom = this.getDom(key);
    const height = this.getHeight(dom, key);
    return top + height;
  }

  getDomDownBottom(key) {
    const top = this.getDomDownTop(key);
    const dom = this.getDom(key);
    const height = this.getHeight(dom, key);
    return top + height;
  }

  getDomDownTop(key) {
    const dom = this.getDom(key);
    if (dom) {
      const offsetTop = dom.offsetTop;
      const { id, } = this;
      const scrollTop = this.getDom(id).scrollTop;
      return offsetTop - scrollTop;
    }
  }

  downView() {
    const { status, } = this;
    const { last, } = status;
    if (last < this.data.length) {
      const top = this.getDomDownTop(this.getKey(last));
      if (top <= status.bottom) {
        if (last + 1 < this.data.length) {
          this.addDownItem(last + 1);
          this.downView();
        }
      }
    }
  }

  addDownItem(k) {
    this.syncInsert(k, 'd');
    if (k < this.data.length) {
      this.status.last = k;
    }
  }

  upView() {
    const { status, } = this;
    const { first, } = status;
    if (first >= 0) {
      const bottom = this.getDomUpBottom(this.getKey(first));
      if (bottom >= status.top) {
        if (first - 1 >= 0) {
          this.addUpItem(first - 1);
          this.upView();
        }
      }
    }
  }

  addUpItem(k) {
    this.syncInsert(k, 'u');
    if (k >= 0) {
      this.status.first = k;
    }
  }

  syncRemove(t) {
    switch (t) {
      case 'u': {
        const { status, } = this;
        const k = status.last;
        if (k < this.data.length) {
          const top = this.getDomUpTop(this.getKey(k));
          const { id, ul, } = this;
          if (top >= this.status.scrollTop + this.getHeight(ul, id)) {
            this.getDom(this.getKey(k)).remove();
            this.doms[this.getKey(k)] = undefined;
            this.status.last = k - 1;
          }
        }
        break;
      }
      case 'd': {
        const { status, } = this;
        const k = status.first;
        if (k >= 0) {
          const bottom = this.getDomDownBottom(this.getKey(k));
          if (this.status.scrollTop >= bottom) {
            this.getDom(this.getKey(k)).remove();
            this.doms[this.getKey(k)] = undefined;
            this.status.first = k + 1;
          }
        }
        break;
      }
    }
  }
}

export default RegionListOffline;
