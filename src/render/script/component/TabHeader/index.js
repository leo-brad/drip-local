import React from 'react';
import style from './index.module.css';
import TabButton from '~/render/script/component/TabButton';
import Dropdown from '~/render/script/component/Dropdown';
import TabButtons from '~/render/script/component/TabButtons';
import global from '~/render/script/obj/global';

class TabHeader extends React.Component {
  render() {
    return (
      <div className={style.tabHeader}>
        <TabButtons />
        <Dropdown />
      </div>
    );
  }
}

export default TabHeader;
