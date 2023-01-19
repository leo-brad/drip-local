import React from 'react';
import style from './index.module.css';
import global from '~/render/script/obj/global';

class Template extends React.Component {
  constructor(props) {
    super(props);
    this.id = new Date().getTime().toString() + 't';
  }

  componentDidMount() {
    const { id, } = this;
    global.template = document.getElementById(id);
  }

  render() {
    const { id, } = this;
    return(
      <div id={id} className={style.template} />
    );
  }
}

export default Template;
