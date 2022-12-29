import React from 'react';
import style from './index.module.css';
import Dimmer from '~/render/script/component/Dimmer';

class Loader extends React.Component {
  render() {
    const { status, active, } = this.props;
    let loader;
    switch (status) {
      case 'stdout':
        loader =
        <div className={style.outer}>
          <Dimmer active={active} />
          <span className={[style.loader, style.success].join(' ')} />
        </div>
        break;
      case 'stderr':
        loader =
        <div className={style.outer}>
          <Dimmer active={active} />
          <span className={[style.loader, style.error].join(' ')} />
        </div>
        break;
      default:
        loader =
        <div className={style.outer}>
          <Dimmer active={active} />
          <span className={[style.loader, style.wait].join(' ')} />
        </div>
        break;
    }
    return loader;
  }
}

export default Loader;
