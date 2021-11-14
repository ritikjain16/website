import { connect } from 'react-redux'
import { notification } from 'antd'
import { withRouter } from 'react-router-dom'
import UmsDashboard from './UmsDashboard'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import { filterKey } from '../../utils/data-utils'

const UmsDashboardNav = withNav(UmsDashboard)({
  title: 'UMS Dashboard',
  activeNavItem: 'User',
  showUMSNavigation: true,
  showCountryDropdown: true,
})

const mapStateToProps = state => ({
  userInvites: state.data.getIn([
    'userInvites',
    'data'
  ]),
  fetchStatusOfUserInvites: state.data.getIn([
    'userInvites',
    'fetchStatus',
    'userInvites'
  ]),
  fetchingUser: state.data.getIn([
    'user',
    'fetchStatus'
  ]),
  fetchFailure: state.data.toJS().user.fetchStatus.user ?
    state.data.toJS().user.fetchStatus.user.failure : false,
  fetchSuccess: state.data.toJS().user.fetchStatus.user ?
    state.data.toJS().user.fetchStatus.user.success : false,
  addingUser: state.data.getIn([
    'user',
    'addStatus',
    'user',
    'loading'
  ]),
  addFailure: state.data.getIn([
    'user',
    'addStatus',
    'user',
    'failure'
  ]),
  addSuccess: state.data.getIn([
    'user',
    'addStatus',
    'user',
    'success'
  ]),
  updatingUser: state.data.getIn([
    'user',
    'updateStatus',
    'user',
    'loading'
  ]),
  updateFailure: state.data.getIn([
    'user',
    'updateStatus',
    'user',
    'failure'
  ]),
  updateSuccess: state.data.getIn([
    'user',
    'updateStatus',
    'user',
    'success'
  ]),
  users: state.data.getIn([
    'userForDashBoard',
    'data'
  ]),
  addedUser: filterKey(
    state.data.getIn([
      'user',
      'data'
    ]), 'user'
  ),
  updatedUser: filterKey(
    state.data.getIn([
      'user',
      'data'
    ]), 'user'
  ),
  deleteUserStatus: state.data.getIn([
    'user',
    'deleteStatus'
  ]),
  parentSignUpStatus: state.data.getIn([
    'parentChildSignUp',
    'addStatus'
  ]),
  usersCount: state.data.toJS().userMeta.data.count,
  fetchingUserCount: state.data.toJS().userMeta.fetchStatus.userMeta ? state.data.toJS().userMeta.fetchStatus.userMeta.loading : '',
  errors: state.data.toJS().errors['user/fetch'],
  addErrors: state.data.toJS().errors['user/add'],
  updateErrors: state.data.toJS().errors['user/update'],
  deleteErrors: state.data.toJS().errors['user/delete'],
  sessionStatus: state.data.getIn(['session', 'fetchStatus', 'bookedSessions']),
  sessionUpdateStatus: state.data.getIn(['session', 'updateStatus', 'bookedSessions']),
  sessionAddStatus: state.data.getIn(['session', 'addStatus', 'bookedSessions']),
  sessionDeleteStatus: state.data.getIn(['session', 'deleteStatus', 'bookedSessions']),
  sessions: filterKey(state.data.getIn([
    'menteeSession',
    'data'
  ]), 'bookedSessions'),
  courses: state.data.getIn(['course', 'data']),
  courseFetchingStatus: state.data.getIn(['course', 'fetchStatus', 'course']),
  mentorMenteeSession: filterKey(state.data.getIn(['mentorMenteeSessions', 'data']), 'bookedSessions'),
  mentorMenteeSessionDeleteStatus: state.data.getIn(['mentorMenteeSessions', 'deleteStatus', 'bookedSessions']),
  mentorMenteeSessionAddStatus: state.data.getIn(['mentorMenteeSessions', 'addStatus', 'bookedSessions']),
  userCoursesFetchStatus: state.data.getIn(['userCourses', 'fetchStatus', 'userCourses']),
  userCourses: state.data.getIn(['userCourses', 'data']),
  userCourseAddStatus: state.data.getIn(['userCourses', 'addStatus', 'userCourses']),
  userCourseAddFailure: state.data.getIn(['errors', 'userCourses/add']),
  userCourseUpdateStatus: state.data.getIn(['userCourses', 'updateStatus', 'userCourses']),
})

const UmsDashboardNavWithExtraProps = injectProps({
  notification
})(UmsDashboardNav)

export default connect(mapStateToProps)(withRouter(UmsDashboardNavWithExtraProps))
