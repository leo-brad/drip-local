import React from 'react';
import style from './index.module.css';
import OfflineComponent from '~/render/script/component/OfflineComponent';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
  status,
} = global;

class TabEdgeButton extends OfflineComponent {
  constructor(props) {
    super(props);
    const {
      k,
    } = this.props;
    this.state = {
      active: true,
    };
    this.id = new Date().getTime().toString() + 'teb';
    this.onClick = this.onClick.bind(this);
  }

  bind() {
    const dom = this.getDom();
    if (dom) {
      dom.addEventListener('click', this.onClick);
    }
  }

  remove() {
    const dom = this.getDom();
    if (dom) {
      dom.removeEventListener('click', this.onClick);
    }
  }

  onClick(e) {
    const { t, } = this.props;
    const { active, } = this.state;
    this.setState({
      active: !active,
    });
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
    const { id, } = this;
    const { t, } = this.props;
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
