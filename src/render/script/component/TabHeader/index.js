import React from 'react';
import style from './index.module.css';
import TabButton from '~/render/script/container/TabButton';

class TabHeader extends React.Component {
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
      <div className={style.tabHeader}>
        {buttons}
      </div>
    );
  };
}

export default TabHeader;
