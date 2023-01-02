import { connect, } from 'react-redux';
import TabButton from '~/render/script/component/TabButton';
import { changeInstance, } from '~/render/script/action/instance';

const mapStateToProps = (state, ownProps) => {
  return {
    status: state.status,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeInstance: (instance) => {
      dispatch(changeInstance(instance));
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(TabButton);
