import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Actions } from '../../states/CallbackListState';
import CallbackList from './CallbackList';

const mapStateToProps = (state) => ({
    callbacks: state['callback'].callbackList.callbacks,
});

const mapDispatchToProps = (dispatch) => ({
    getCallbacks: bindActionCreators(Actions.getCallbacks, dispatch),
    deleteCallback: bindActionCreators(Actions.deleteCallback, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CallbackList);