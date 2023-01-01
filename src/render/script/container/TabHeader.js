import { connect, } from 'react-redux';
import TabHeader from '~/render/script/component/TabHeader';
import { changeInstance, } from '~/render/script/action/instance';

const mapStateToProps = (state, ownProps) => {
  return {
    instance: state.instance,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeInstance: (instance) => {
      dispatch(changeInstance(instance));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabHeader);
