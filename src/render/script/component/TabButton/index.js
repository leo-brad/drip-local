import React from 'react';
import style from './index.module.css';
import InstanceIcon from '~/render/script/component/InstanceIcon';
import Loader from '~/render/script/component/Loader';

class TabButton extends React.Component {
  constructor(props) {
    super(props);
    this.id = new Date().getTime();
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    const { changeInstance, } = this.props;
    changeInstance(instance);
    e.preventDefault();
    e.preventPropagation();
  }

  componentDidMount() {
    const { id, } = this;
    this.dom = document.getElementById(id);
    const { dom, } = this;
    dom.addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    const { dom, } = this;
    dom.removeEventListener('click', this.onClick);
  }

  render() {
    const { id, } = this;
    const { t, i, instance, status, } = this.props;
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
    let button =
    <button
      id={id} className={cns.join(' ')}
      >
      <InstanceIcon />{i}<Loader status={status[i]} active={active} />
    </button>;
    return button;
  }
}

export default TabButton;
