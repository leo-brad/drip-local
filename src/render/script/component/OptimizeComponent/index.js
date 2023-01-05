import React from 'react';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
} = global;

class OptimizeComponent extends React.Component {
  componentDidMount() {
    const { ownDidMount, } = this;
    if (typeof ownDidMount === 'function') {
      ownDidMount();
    }
    this.bind();
    emitter.on('window/focus', this.bind);
    emitter.on('window/blur', this.remove);
  }

  componentWillUnmount() {
    const { ownWillUnmount, } = this;
    if (typeof ownWillUnmount === 'function') {
      ownWillUnmount();
    }
    this.remove();
    emitter.on('window/focus', this.bind);
    emitter.on('window/blur', this.remove);
  }
}

export default OptimizeComponent;
