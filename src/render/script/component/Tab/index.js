import React from 'react';
import style from './index.module.css';
import Content from '~/render/script/component/Content';
import TabHeader from '~/render/script/component/TabHeader';

class Tab extends React.Component {
  render() {
    return (
      <div className={style.tab}>
        <TabHeader />
        <div className={style.tabBanner}></div>
        <div className={style.tabMain}>
          <Content />
        </div>
      </div>
    );
  }
}

export default Tab;
