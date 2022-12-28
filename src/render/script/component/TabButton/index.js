import React from 'react';
import style from './index.module.css';
import InstanceIcon from '~/render/script/component/InstanceIcon';
import Loader from '~/render/script/component/Loader';

class TabButton extends React.Component {
  render() {
    const { i, instance, status, } = this.props;
    return (
      <button id={'button-' + i}
        className={[
          style.tabButton,
          style.tabButtonFirst,
          instance === i ? style.active : null,
        ].join(' ')}
      >
        <InstanceIcon />{i}<Loader status={status[i]} />
      </button>
    );
  }
}

export default TabButton;
