import { connect, } from 'react-redux';
import TabButton from '~/render/script/component/TabButton';

const mapStateToProps = (state, ownProps) => {
  return {
    status: state.status,
  };
}

export default connect(mapStateToProps)(TabButton);
