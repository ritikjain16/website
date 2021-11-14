import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import { filterKey } from '../../../utils/data-utils'
import BatchAttendance from './BatchAttendance'
import withNav from '../../../components/withNav'
import injectProps from '../../../components/injectProps'

const BatchAttendanceNav = withNav(BatchAttendance)({
  title: 'Batch Attendance',
  activeNavItem: 'Batch Attendance',
  showSMSNavigation: true,
})

const mapStateToProps = (state) => ({
  batches: filterKey(state.data.getIn([
    'batchSessions',
    'data'
  ]), 'batchSessions/sms'),
  batchFetchStatus: state.data.getIn([
    'batchSessions',
    'fetchStatus',
    'batchSessions/sms',
  ]),
  batchUpdatingStatus: state.data.getIn([
    'batchSession',
    'updateStatus',
    'batchSession/sms',
  ]),
  isFetchingBatches: state.data.getIn([
    'batchSessions',
    'fetchStatus',
    'batchSessions',
    'loading'
  ]),
  hasFetchedBatches: state.data.getIn([
    'batchSessions',
    'fetchStatus',
    'batchSessions/sms',
    'success'
  ]),
  isUpdatingBatchSession: state.data.getIn([
    'batchSession',
    'updateStatus',
    'batchSession/sms',
    'loading'
  ]),
  hasUpdatedBatchSession: state.data.getIn([
    'batchSession',
    'updateStatus',
    'batchSession/sms',
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
