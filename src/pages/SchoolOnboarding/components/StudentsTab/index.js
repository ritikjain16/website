import { connect } from 'react-redux'
import { filterKey } from '../../../../utils/data-utils'
import StudentsTab from './StudentsTab'

const mapStateToProps = (state) => ({
  studentProfiles: filterKey(state.data.getIn(['studentProfiles', 'data']), 'studentProfiles'),
  studentProfilesFetchStatus: state.data.getIn(['studentProfiles', 'fetchStatus', 'studentProfiles']),
  studentProfilesMeta: state.data.getIn(['studentProfilesMeta', 'data', 'count']),
  studentProfileUpdateStatus: state.data.getIn(['studentProfiles', 'updateStatus', 'studentProfiles']),
  parentSignUpStatus: state.data.getIn([
    'parentChildSignUp', 'addStatus', 'addParentSignUp'
  ]),
})


export default connect(mapStateToProps)(StudentsTab)
