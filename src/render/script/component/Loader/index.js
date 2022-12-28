import React from 'react';
import style from './index.module.css';

class Loader extends React.Component {
  render() {
    const { status, } = this.props;
    let loader;
    switch (status) {
      case 'stdout':
        loader = <span className={[style.loader, style.success].join(' ')} />;
        break;
      case 'stderr':
        loader = <span className={[style.loader, style.error].join(' ')} />;
        break;
      default:
        loader = <span className={[style.loader, style.wait].join(' ')} />;
        break;
    }
    return loader;
  }
}

export default Loader;
