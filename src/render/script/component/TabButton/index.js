import React from 'react';
import style from './index.module.css';
import OfflineComponent from '~/render/script/component/OfflineComponent';
import InstanceIcon from '~/render/script/component/InstanceIcon';
import Loader from '~/render/script/component/Loader';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
   status,
} = global;

class TabButton extends OfflineComponent {
  constructor(props) {
    super(props);
    const { k, } = this.props;
    this.id = new Date().getTime() + k.toString();
    this.state = {
      status: '',
      instance: '',
    };
    this.onClick = this.onClick.bind(this);
    this.dealEvent = this.dealEvent.bind(this);
    this.changeInstance = this.changeInstance.bind(this);
  }

  dealEvent(data) {
    const {
      share: {
        focus,
      },
    } = global;
    if (focus) {
      const [event] = data;
      switch (event) {
        case 'status/update': {
          const { i, } = this.props;
          this.setState({
            status: status[i],
          });
          break;
        }
        case 'instance/change':
        case 'instance/add/first': {
          const { instance, } = global;
          this.setState({
            instance,
          });
          break;
        }
      }
    }
  }

  changeInstance(instance) {
    this.setState({
      instance,
    });
  }

  bind() {
    const { i, } = this.props;
    emitter.on('instance/change', this.changeInstance);
    emitter.on(i, this.dealEvent);
    const dom = this.getDom();
    if (dom) {
      dom.addEventListener('click', this.onClick);
    }
  }

  remove() {
    const { i, } = this.props;
    emitter.remove('instance/change', this.changeInstance);
    emitter.remove(i, this.dealEvent);
    const dom = this.getDom();
    if (dom) {
      dom.removeEventListener('click', this.onClick);
    }
  }

  onClick(e) {
    const { i, } = this.props;
    emitter.send('instance/change', i);
    e.preventDefault();
    e.stopPropagation();
  }

  getDom() {
    const { dom, id, } = this;
    if (dom === undefined) {
      this.dom = document.getElementById(id);
    }
    return this.dom;
  }

  render() {
    const { id, } = this;
    const { t, i, } = this.props;
    const { instance, } = this.state;
    const active = instance === i;
    let cns = [style.tabButton, active ? style.active : null];
    switch (t) {
      case 'f':
        cns.push(style.tabButtonFirst);
        break;
      case 'l':
        cns.push(style.tabButtonLast);
        break;
      default:
        break;
    }
    return(
      <button id={id} className={cns.join(' ')}>
        <InstanceIcon />{i}<Loader status={this.state.status} active={active} />
      </button>
    );
  }
}

export default TabButton;
