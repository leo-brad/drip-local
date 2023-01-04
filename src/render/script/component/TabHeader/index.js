import React from 'react';
import style from './index.module.css';
import OptimizeComponent from '~/render/script/component/OptimizeComponent';
import TabButton from '~/render/script/component/TabButton';
import global from '~/render/script/obj/global';

const {
  emitter,
  instances,
} = global;

class TabHeader extends OptimizeComponent {
  constructor(props) {
    super(props);
    this.state = {
      instance: '',
      instances: [],
    };
    this.updateView = this.updateView.bind(this);
  }

  bind() {
    emitter.on('instance/add', this.updateView);
    emitter.on('instance/reduce', this.updateView);
  }

  remove() {
    emitter.remove('instance/add', this.updateView);
    emitter.remove('instance/reduce', this.updateView);
  }

  updateView(data) {
    const { focus, } = global;
    if (focus) {
      setTimeout(() => {
        const { instances, } = global;
        this.setState({
          instances,
        });
      }, 0);
    }
  }

  render() {
    const {
      instances,
    } = this.state;
    const buttons = instances.map((i, k) => {
      switch (k) {
        case 0:
          return <TabButton t="f" i={i} key={k} />
        case instances.length - 1:
          return <TabButton t="l" i={i} key={k} />;
        default:
          return <TabButton i={i} key={k} />
      }
    });
    return (
      <div className={style.tabHeader}>
        {buttons}
      </div>
    );
  }
}

export default TabHeader;
