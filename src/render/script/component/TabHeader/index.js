import React from 'react';
import style from './index.module.css';
import TabButton from '~/render/script/container/TabButton';

class TabHeader extends React.Component {
  componentDidMount() {
    const { changeInstance, } = this.props;
    document.getElementById('tab-header').addEventListener('click', (e) => {
      if (/^button-/.test(e.target.id)) {
        const [_, instance] = e.target.id.split('-');
        changeInstance(instance);
      }
    });
  }

  render() {
    const { instance: { instances, instance, } } = this.props;
    const buttons = instances.map(
      (i, k) => {
        switch (k) {
          case 0:
            return(
              <
                TabButton
                t="f" i={i} key={k} instance={instance}
              />
            );
          case instances.length - 1:
            return(
              <
                TabButton
                t="l" i={i} key={k} instance={instance}
              />
            );
          default:
            return(
              <
                TabButton
                i={i} key={k} instance={instance}
              />
            );
        }
      }
    );
    return (
      <div id='tab-header' className={style.tabHeader}>
        {buttons}
      </div>
    );
  };
}

export default TabHeader;
