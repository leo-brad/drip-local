import React from 'react';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
} = global;

class Offline extends React.Component {
  constructor(props) {
    super(props);
    this.bind = this.bind.bind(this);
    this.remove = this.remove.bind(this);
    this.focus = this.focus.bind(this);
  }

  focus() {
    const {
      focus,
    } = global;
    if (!focus) {
      this.bind();
    }
  }

  componentDidMount() {
    const { ownDidMount, } = this;
    if (typeof ownDidMount === 'function') {
      this.ownDidMount();
    }
    this.bind();
    emitter.on('window/focus', this.focus);
    emitter.on('window/blur', this.remove);
  }

  componentWillUnmount() {
    const { ownWillUnmount, } = this;
    if (typeof ownWillUnmount === 'function') {
      this.ownWillUnmount();
    }
    this.remove();
    emitter.remove('window/focus', this.focus);
    emitter.remove('window/blur', this.remove);
  }
}

export default Offline;
