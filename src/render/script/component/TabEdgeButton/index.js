import React from 'react';
import style from './index.module.css';
import Offline from '~/render/script/component/Offline';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
  status,
} = global;

class TabEdgeButton extends Offline {
  constructor(props) {
    super(props);
    const { t, } = this.props;
    this.state = {
      active: true,
    };
    this.id = new Date().getTime().toString() + t;
    this.onClick = this.onClick.bind(this);
    this.dealDropdown = this.dealDropdown.bind(this);
  }

  dealDropdown([event]) {
    switch (event) {
      case 'click':
      case 'blur':
        this.setState({
          active: true,
        });
        break;
    }
  }

  bind() {
    const dom = this.getDom();
    if (dom) {
      dom.addEventListener('click', this.onClick);
    }
    emitter.on('dropdown', this.dealDropdown);
  }

  remove() {
    const dom = this.getDom();
    if (dom) {
      dom.removeEventListener('click', this.onClick);
    }
    emitter.remove('dropdown', this.dealDropdown);
  }

  onClick(e) {
    const { t, } = this.props;
    const { active, } = this.state;
    this.setState({
      active: !active,
    });
    global.type = t;
    switch (active) {
      case true:
        emitter.send('dropdown', ['show', t]);
        break;
      case false:
        emitter.send('dropdown', ['hidden', t]);
        break;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  getDom() {
    const { dom, id, } = this;
    if (!dom) {
      this.dom = document.getElementById(id);
    }
    return this.dom;
  }

  render() {
    const { t, } = this.props;
    const { id, } = this;
    const { active, } = this.state;
    let cns = [style.tabButton, active ? style.active : null];
    let content;
    switch (t) {
      case 'l':
        cns.push(style.leftTabButton);
        break;
      case 'r':
        cns.push(style.rightTabButton);
        break;
      default:
        break;
    }
    return(
      <button id={id} className={cns.join(' ')} / >
    );
  }
}

export default TabEdgeButton;
