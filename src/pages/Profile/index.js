import { notification } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Profile from './Profile'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import { filterKey } from '../../utils/data-utils'

const ProfileWithNav = withNav(Profile)({
  title: 'Manage kids',
  activeNavItem: 'Manage Kids',
  showUMSNavigation: true,
})

const mapStateToProps = (state) => ({
  profileInfoFetchStatus: state.data.getIn([
    'profileInfo',
    'fetchStatus',
    'menteeProfile'
  ]),
  salesOperation: filterKey(
    state.data.getIn([
      'salesOperation',
      'data'
    ]),
    'menteeProfile'
  ),
  userCount: state.data.getIn([
    'salesOperationsMeta',
    'data'
  ]),
  mentors: filterKey(
    state.data.getIn([
      'user',
      'data'
    ]),
    'user/mentor'
  ),
  mentorFetchStatus: state.data.getIn([
    'user',
    'fetchStatus',
    'user/mentor'
  ]),
  updatingAllottedMentor: state.data.getIn([
    'salesOperation',
    'updateStatus'
  ]),
  updatedSalesOps: state.data.getIn([
    'completedSession',
    'data'
  ]),
  userCurrentTopicComponentStatus: state.data.getIn([
    'userCurrentTopicComponentStatus',
    'data'
  ]),
  updateSkillLevelStatus: state.data.getIn([
    'userCurrentTopicComponentStatus',
    'updateStatus'
  ]),
  convertedUsers: filterKey(
    state.data.getIn([
      'salesOperation',
      'data'
    ]), 'convertedUser'
  ),
  convertedUserFetchStatus: state.data.getIn([
    'salesOperation',
    'fetchStatus',
    'convertedUser'
  ]),
  mentorMenteeSessions: state.data.getIn([
    'completedSession',
    'data'
  ]),
  topics: filterKey(
    state.data.getIn([
      'topic',
      'data'
    ]), 'menteeProfile'
  ),
  menteeSessions: state.data.getIn([
    'menteeSession',
    'data'
  ]),
  courses: state.data.getIn([
    'course',
    'data'
  ]),
  mentorSessionFetchStatus: state.data.getIn([
    'session',
    'fetchStatus'
  ]),
  mentorSession: state.data.getIn([
    'session',
    'data'
  ]),
  menteeSessionBookingStatus: state.data.getIn([
    'menteeSession',
    'addStatus'
  ]),
  mentorSessionBookingStatus: state.data.getIn([
    'session',
    'addStatus'
  ]),
  mentorSessionUpdateStatus: state.data.getIn([
    'session',
    'updateStatus'
  ]),
  menteeSessionDeleteStatus: state.data.getIn([
    'menteeSession',
    'deleteStatus'
  ]),
  mentorMenteeSessionAddStatus: state.data.getIn([
    'mentorMenteeSession',
    'addStatus'
  ]),
  mentorMenteeSessionDeleteStatus: state.data.getIn([
    'mentorMenteeSession',
    'deleteStatus'
  ]),
  menteeSessionUpdateStatus: state.data.getIn([
    'menteeSession',
    'updateStatus'
  ]),
  errors: state.data.getIn([
    'errors'
  ])
})

const ProfileWithNavWithExtraProps = injectProps({
  notification
})(ProfileWithNav)

export default connect(mapStateToProps)(withRouter(ProfileWithNavWithExtraProps))
