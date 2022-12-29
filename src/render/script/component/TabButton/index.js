import React from 'react';
import style from './index.module.css';
import InstanceIcon from '~/render/script/component/InstanceIcon';
import Loader from '~/render/script/component/Loader';

class TabButton extends React.Component {
  render() {
    const { t, i, instance, status, } = this.props;
    let cns = [style.tabButton, instance === i ? style.active : null];
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
      id={'button-' + i} className={cns.join(' ')}
      >
      <InstanceIcon />{i}<Loader status={status[i]} />
    </button>;
    return button;
  }
}

export default TabButton;
