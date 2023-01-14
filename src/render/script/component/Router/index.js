import React from 'react';
import '~/render/style/index.css';
import global from '~/render/script/obj/global';
import Home from '~/render/script/page/Home';
import Exception from '~/render/script/page/Exception';

const {
  location,
} = global;

class Router extends React.Component {
  constructor(props) {
    super(props);
    this.fn =  {
      '/': Home,
      '/error': Exception,
    };
    this.component = {};
    this.state = {
      location: '/',
    };
    this.bindEvent();
  }

  bindEvent() {
    location.onChange((location) => {
      this.setState({
        location,
      });
    });
  }

  getPage(path) {
    const { component, } = this;
    if (component[path] === undefined) {
      const Page = this.fn[path];
      component[path] = <Page />;
    }
    return component[path];
  }

  render() {
    const { location, } = this.state;
    return this.getPage(location);
  }
}

export default Router;
