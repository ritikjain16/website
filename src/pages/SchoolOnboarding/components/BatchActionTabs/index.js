import { connect } from 'react-redux'
import { filterKey } from '../../../../utils/data-utils'
import BatchActionTabs from './BatchActionTabs'

const mapStateToProps = (state) => ({
  batchData: state.data.getIn(['batchesData', 'data']),
  batchFetchingStatus: state.data.getIn(['batchesData', 'fetchStatus', 'batchesData']),
  batchUpdatingStatus: state.data.getIn(['batch', 'updateStatus', 'batchesData']),
  batchUpdatingError: state.data.getIn([
    'errors',
    'batch/update'
  ]),
  studentProfiles: filterKey(state.data.getIn(['studentProfiles', 'data']), 'studentProfiles'),
  studentProfilesFetchStatus: state.data.getIn(['studentProfiles', 'fetchStatus', 'studentProfiles']),
  studentsSearch: filterKey(state.data.getIn(['studentProfiles', 'data']), 'batchStudents'),
  isStudentsSearchFetching: state.data.getIn(['studentProfiles', 'fetchStatus', 'batchStudents']),
  batchSessions: filterKey(state.data.getIn(['batchSessions', 'data']), 'batchSessions'),
  batchSessionsFetchingStatus: state.data.getIn(['batchSessions', 'fetchStatus', 'batchSessions'])
})


export default connect(mapStateToProps)(BatchActionTabs)

