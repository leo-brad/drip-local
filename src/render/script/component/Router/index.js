import React from 'react';
import '~/render/style/index.css';
import global from '~/render/script/obj/global';
import Home from '~/render/script/page/Home';
import OfflineComponent from '~/render/script/component/OfflineComponent';

const {
  share: {
    emitter,
  },
  location,
} = global;

class Router extends OfflineComponent {
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

  showError() {
    this.addRoute('/error', require('~/render/script/page/Exception'));
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
