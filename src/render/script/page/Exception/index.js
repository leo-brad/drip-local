import React from 'react';
import global from '~/render/script/obj/global';

const {
  emitter,
} = global;

class Exception extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  componentDidMount() {
    const { error, } = global;
    this.setState({
      error: error,
    });
  }

  render() {
    const { error, } = this.state;
    let e;
    if (error) {
      e = <div>{error.toString()}</div>;
    } else {
      e = <div></div>
    }
    return e;
  }
}

export default Exception;
