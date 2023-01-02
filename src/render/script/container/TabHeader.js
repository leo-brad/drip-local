import { connect, } from 'react-redux';
import TabHeader from '~/render/script/component/TabHeader';

const mapStateToProps = (state, ownProps) => {
  return {
    instance: state.instance,
  };
}

export default connect(mapStateToProps)(TabHeader);
