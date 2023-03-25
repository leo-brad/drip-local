import React from 'react';
import '~/render/style/index.css';
import global from '~/render/script/obj/global';
import Home from '~/render/script/page/Home';

const {
  share: {
    emitter,
  },
  location,
} = global;

class Router extends React.Component {
  constructor(props) {
    super(props);
    this.route =  {
      '/': Home,
    };
    this.component = {};
    this.state = {
      location: '/',
    };
    this.bindEvent();
    this.showError = this.showError.bind(this);
    return this;
  }

  bindEvent() {
    location.onChange((location) => {
      this.setState({
        location,
      });
    });
  }

  async showError() {
    const Exception = await import('~/render/script/page/Exception');
    this.addRoute('/error', Exception.default);
    location.to('/error');
  }

  bind() {
    emitter.on('error', this.showError);
  }

  remove() {
    emitter.remove('error', this.showError);
  }

  addRoute(path, module) {
    const component = module.default;
    const { route, } = this;
    if (route[path] === undefined) {
      route[path] = component;
    }
    return route[path];
  }

  getPage(path) {
    const { component, } = this;
    if (component[path] === undefined) {
      const Page = this.route[path];
      if (Page) {
        component[path] = <Page />;
      } else {
        component[path] = null;
      }
    }
    return component[path];
  }

  render() {
    const { location, } = this.state;
    return this.getPage(location);
  }
}

export default Router;
