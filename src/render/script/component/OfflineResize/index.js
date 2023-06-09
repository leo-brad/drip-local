import React from 'react';
import global from '~/render/script/obj/global';
import Offline from '~/render/script/component/Offline';

const {
  share: {
    emitter,
  },
} = global;

class OfflineResize extends Offline {
  constructor(props) {
    super(props);
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    const { ownDidMount, } = this;
    if (typeof ownDidMount === 'function') {
      this.ownDidMount();
    }
    this.bind();
    emitter.on('window/focus', this.focus);
    emitter.on('window/blur', this.remove);
    emitter.on('window/resize', this.resize);
  }

  componentWillUnmount() {
    const { ownWillUnmount, } = this;
    if (typeof ownWillUnmount === 'function') {
      this.ownWillUnmount();
    }
    this.remove();
    emitter.remove('window/focus', this.focus);
    emitter.remove('window/blur', this.remove);
    emitter.remove('window/resize', this.resize);
  }
}

export default OfflineResize;
