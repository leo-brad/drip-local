import React from 'react';
import style from './index.module.css';

class Dimmer extends React.Component {
  render() {
    const { active, } = this.props;
    let dimmer;
    if (active === false) {
      dimmer = <div className={[style.dimmer, style.active].join(' ')} />
    } else {
      dimmer = <div className={style.dimmer} />
    }
    return dimmer;
  }
}

export default Dimmer;
