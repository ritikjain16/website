import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import { filterKey } from '../../utils/data-utils'
import BatchAttendance from './BatchAttendance'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'

const BatchAttendanceNav = withNav(BatchAttendance)({
  title: 'Batch Attendance',
  activeNavItem: 'Batch Attendance',
  showUMSNavigation: true,
})

const mapStateToProps = (state) => ({
  batches: filterKey(state.data.getIn([
    'batchSessions',
    'data'
  ]), 'batchSessions'),
  batchFetchStatus: state.data.getIn([
    'batchSessions',
    'fetchStatus',
    'batchSessions',
  ]),
  hasFetchedBatches: state.data.getIn([
    'batchSessions',
    'fetchStatus',
    'batchSessions',
    'success'
  ]),
  batchUpdatingStatus: state.data.getIn([
    'batchSession',
    'updateStatus',
    'batchSession',
  ]),
  isUpdatingBatchSession: state.data.getIn([
    'batchSession',
    'updateStatus',
    'batchSession',
    'loading'
  ]),
  hasUpdatedBatchSession: state.data.getIn([
    'batchSession',
    'updateStatus',
    'batchSession',
    'success'
  ]),
  isStartingSession: state.data.getIn([
    'batchSession',
    'updateStatus',
    'sessionStatusUpdate',
    'loading'
  ]),
  hasStartedSession: state.data.getIn([
    'batchSession',
    'updateStatus',
    'sessionStatusUpdate',
    'success'
  ]),
  sessionStartError: state.data.getIn([
    'batchSession',
    'updateStatus',
    'sessionStatusUpdate',
    'failure'
  ]),
  isUpdatingAttendance: state.data.getIn([
    'batchSession',
    'updateStatus',
    'attendanceUpdate',
    'loading'
  ]),
  hasUpdatedAttendance: state.data.getIn([
    'batchSession',
    'updateStatus',
    'attendanceUpdate',
    'success'
  ]),
  isUpdatingAttendanceAll: state.data.getIn([
    'batchSession',
    'updateStatus',
    'attendanceAllUpdate',
    'loading'
  ]),
  hasUpdatedAttendanceAll: state.data.getIn([
    'batchSession',
    'updateStatus',
    'attendanceAllUpdate',
    'success'
  ]),
  updateAttendanceError: state.data.getIn([
    'batchSession',
    'updateStatus',
    'attendanceUpdate',
    'failure'
  ]),
  mentors: filterKey(state.data.getIn([
    'user',
    'data'
  ]), 'mentors'),
  isFetchingMentors: state.data.getIn([
    'mentorProfiles',
    'fetchStatus',
    'mentors',
    'loading'
  ]),
  hasFetchedMentors: state.data.getIn([
    'mentorProfiles',
    'fetchStatus',
    'mentors',
    'success'
  ]),
  batchSessionsMeta: state.data.getIn(['batchSessionsMeta', 'data', 'count']),
})

const BatchAttendanceNavWithExtraProps = injectProps({
  notification
})(BatchAttendanceNav)


export default connect(mapStateToProps)(withRouter(BatchAttendanceNavWithExtraProps))
