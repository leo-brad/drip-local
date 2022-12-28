import React from 'react';
import style from './index.module.css';
import Content from '~/render/script/component/Content';
import TabButton from '~/render/script/component/TabButton';

class Tab extends React.Component {
  componentDidMount() {
    document.getElementById('tab-header').addEventListener('click', (e) => {
      if (/^button-/.test(e.target.id)) {
        const [_, instance] = e.target.id.split('-');
        this.props.changeInstance(instance);
      }
    });
  }

  render() {
    const { instance: { instances, instance, }, status, } = this.props;
    const buttons = instances.map(
      (i, k) => <TabButton i={i} key={k} instance={instance} status={status} />
    );
    return (
      <div className={style.tab}>
        <div id='tab-header' className={style.tabHeader}>
          {buttons}
        </div>
        <div className={style.tabStrip}></div>
        <div className={style.tabMain}><Content {...this.props} /></div>
      </div>
    );
  }
}

export default Tab;
