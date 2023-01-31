import React from 'react';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
} = global;

class OfflineComponent extends React.Component {
  constructor(props) {
    super(props);
    this.bind = this.bind.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    const { ownDidMount, } = this;
    if (typeof ownDidMount === 'function') {
      this.ownDidMount();
    }
    this.bind();
    emitter.on('window/focus', this.bind);
    emitter.on('window/blur', this.remove);
  }

  componentWillUnmount() {
    const { ownWillUnmount, } = this;
    if (typeof ownWillUnmount === 'function') {
      this.ownWillUnmount();
    }
    this.remove();
    emitter.remove('window/focus', this.bind);
    emitter.remove('window/blur', this.remove);
  }
}

export default OfflineComponent;
