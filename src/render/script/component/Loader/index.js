import React from 'react';
import style from './index.module.css';
import Dimmer from '~/render/script/component/Dimmer';
import global from '~/render/script/obj/global';

const {
  share: {
    emitter,
  },
} = global;

function getDegString(deg) {
  return 'rotate(' + deg + 'deg)';
}

class Loader extends React.Component {
  constructor(props) {
    super(props);
    const { status, } = this.props;
    if (!status) {
      this.state = {
        deg: 0,
      };
      this.endAnimation = this.endAnimation.bind(this);
      this.startAnimation = this.startAnimation.bind(this);
      this.spinAnimation = this.spinAnimation.bind(this);
    }
  }

  componentDidMount() {
    const { status, } = this.props;
    if (!status) {
      this.startAnimation();
      emitter.on('window/focus', this.startAnimation);
      emitter.on('window/blur', this.endAnimation);
    }
  }

  componentWillUnmount() {
    const { status, } = this.props;
    this.endAnimation();
    if (!status) {
      emitter.remove('window/focus', this.startAnimation);
      emitter.remove('window/blur', this.endAnimation);
    }
  }

  startAnimation() {
    const { id, } = this;
    if (id === undefined) {
      this.id = setInterval(this.spinAnimation, 1000 / 29);
    }
  }

  endAnimation() {
    const { id, } = this;
    if (id !== undefined) {
      clearInterval(id);
      this.id = undefined;
    }
  }

  spinAnimation() {
    const { deg, } = this.state;
    this.setState({
      deg: deg + 6,
    });
  }

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
      default: {
        const { deg, } = this.state;
        loader =
        <span
          style={{transform: getDegString(deg)}}
          className={[style.loader, style.wait].join(' ')}
        />;
        break;
      }
    }
    return loader;
  }
}

export default Loader;
