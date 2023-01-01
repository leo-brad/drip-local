import { connect, } from 'react-redux';
import Content from '~/render/script/component/Content';

const mapStateToProps = (state, ownProps) => {
  return {
    instance: state.instance,
    pkg: state.pkg,
    component: state.component,
  };
}

export default connect(mapStateToProps)(Content);
