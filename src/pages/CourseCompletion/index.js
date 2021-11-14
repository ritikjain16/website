import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import { filterKey } from '../../utils/data-utils'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import CourseCompletion from './CourseCompletion'

const CourseCompletionNav = withNav(CourseCompletion)({
  title: 'Course Completion',
  activeNavItem: 'Course Completion',
  showUMSNavigation: true
})

const mapStateToProps = (state) => ({
  courseCompletionFetchStatus: state.data.getIn(['userCourseCompletions', 'fetchStatus', 'userCourseCompletions']),
  courseCompletionData: filterKey(state.data.getIn(['userCourseCompletions', 'data']), 'userCourseCompletions'),
  schoolsData: filterKey(state.data.getIn(['schools', 'data']), 'userCourseCompletions'),
  courseCompletionUpdateStatus: state.data.getIn(['userCourseCompletions', 'updateStatus', 'userCourseCompletions']),
  sendCertificateUpdateStatus: state.data.getIn(['sendCertificateInMail', 'updateStatus', 'sendCertificateInMail']),
  sendJourneySnapshotUpdateStatus: state.data.getIn(['sendJourneySnapshotInMail', 'updateStatus', 'sendJourneySnapshotInMail']),
  userSavedCodes: filterKey(state.data.getIn(['userSavedCodes', 'data']), 'userSavedCodes'),
})

const CourseCompletionWithExtraProps = injectProps({
  notification,
})(CourseCompletionNav)

export default connect(mapStateToProps)(
  withRouter(CourseCompletionWithExtraProps)
)
