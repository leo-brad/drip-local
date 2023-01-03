import React from 'react';
import style from './index.module.css';
import InstanceIcon from '~/render/script/component/InstanceIcon';
import Loader from '~/render/script/component/Loader';
import global from '~/render/script/obj/global';

const { emitter, status, } = global;

class TabButton extends React.Component {
  constructor(props) {
    super(props);
    this.id = new Date().getTime();
    this.state = {
      status: '',
      instance: '',
    };
    this.onClick = this.onClick.bind(this);
    this.dealEvent = this.dealEvent.bind(this);
  }

  dealEvent(data) {
    const { focus, } = global;
    if (focus) {
      const [event] = data;
      switch (event) {
        case 'status/update': {
          setTimeout(() => {
            const { i, } = this.props;
            this.setState({
              status: status[i],
            });
          }, 0);
          break;
        }
        case 'instance/change':
        case 'instance/add/first':
          setTimeout(() => {
            const { instance, } = global;
            this.setState({
              instance,
            });
          }, 0);
          break;
      }
    }
  }

  componentDidMount() {
    const { i, } = this.props;
    emitter.on(i, this.dealEvent);
    this.getDom().addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    const { i, } = this.props;
    emitter.remove(i, this.dealEvent);
    this.getDom().removeEventListener('click', this.onClick);
  }

  onClick(e) {
    const { instance, } = global;
    const event = 'instance/update';
    emitter.send(instance, [event]);
    e.preventDefault();
    e.preventPropagation();
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
    const { instance, } = global;
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
