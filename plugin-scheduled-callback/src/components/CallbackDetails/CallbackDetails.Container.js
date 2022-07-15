import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Actions } from '../../states/CallbackListState';
import CallbackDetails from './CallbackDetails';

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
   addCallback: bindActionCreators(Actions.addCallback, dispatch),
  // deleteCallback: bindActionCreators(Actions.deleteCallback, dispatch),
   updateCallback: bindActionCreators(Actions.updateCallback, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CallbackDetails);