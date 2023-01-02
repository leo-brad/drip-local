import React from 'react';
import style from './index.module.css';
import global from '~/render/script/obj/global';

const { emitter, content, component, pkg, } = global;

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.updateContent = this.updateContent.bind(this);
  }

  updateContent({ instance: i, }) {
    const {
      instance: { instance, },
    } = this.props;
    if (instance === i) {
      this.forceUpdate();
    }
  }

  componentDidMount() {
    emitter.on('content/update', this.updateContent);
  }

  componentWillUnmount() {
    emitter.remove('content/update', this.updateContent);
  }

  render() {
    const {
      instance: { instance, },
    } = this.props;
    const { index, contents, } = content;
    const idx = index[instance];
    let main;
    if (typeof idx === 'number' && contents[idx]) {
      const data = contents[idx];
      if (component[instance] === undefined) {
        const [_, i] = instance.match(/^\[(\w+)\]:(\w+)$/);
        const Pkg = pkg[i];
        main = <Pkg data={data} emitter={emitter} />
        component[instance] = main;
      } else {
        main = component[instance];
      }
    } else {
      main = null;
    }
    return main;
  }
}

export default Content;
