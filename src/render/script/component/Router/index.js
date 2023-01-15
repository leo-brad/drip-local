import React from 'react';
import '~/render/style/index.css';
import global from '~/render/script/obj/global';
import Home from '~/render/script/page/Home';

const {
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
  }

  bindEvent() {
    location.onChange((location) => {
      this.setState({
        location,
      });
    });
  }

  addRoute(path, component) {
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
