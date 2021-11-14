import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import { filterKey } from '../../utils/data-utils'
import MentorDashboard from './MentorDashboard'
import withMentorDashboardNav from '../../components/withUpdatedNav'
import injectProps from '../../components/injectProps'

const MentorDashboardSideNav = withMentorDashboardNav(MentorDashboard)({
  title: 'Mentor Dashboard',
  activeNavItem: 'Calendar',
  showUMSNavigation: true,
})

const mapStateToProps = state => ({
  mentorSessions: filterKey(
    state.data.getIn([
      'mentorSessions',
      'data'
    ]), 'mentorSessions'
  ),
  sessionLogs: filterKey(
    state.data.getIn([
      'sessionLogs',
      'data'
    ]), 'sessionLogsData'
  ),
  mentors: filterKey(
    state.data.getIn([
      'user',
      'data'
    ]), 'user'
  ),
  prevMentorSession: filterKey(
    state.data.getIn([
      'mentorSessions',
      'data'
    ]), 'prevMentorSession'
  ),
  mentorSessionsAddStatus: state.data.getIn([
    'mentorSessions',
    'addStatus',
    'mentorSessions',
  ]),
  mentorSessionsAddedFailure: state.data.getIn(['errors', 'mentorSessions/add']),
  mentorSessionsUpdateFailure: state.data.getIn(['errors', 'mentorSessions/update']),
  isMentorSessionsLoading: state.data.getIn([
    'mentorSessions',
    'fetchStatus',
    'mentorSessions',
    'loading'
  ]),
  isPrevMentorSessionsLoading: state.data.getIn([
    'mentorSessions',
    'fetchStatus',
    'prevMentorSession',
    'loading'
  ]),
  isMentorSessionsAdding: state.data.getIn([
    'mentorSessions',
    'addStatus',
    'mentorSessions',
    'loading'
  ]),
  isMentorSessionsAdded: state.data.getIn([
    'mentorSessions',
    'addStatus',
    'mentorSessions',
    'success'
  ]),
  updateSessionStatus: state.data.getIn([
    'mentorSessions',
    'updateStatus',
    'updateMentorMenteeSession',
  ]),
  updateMenteeStatus: state.data.getIn([
    'mentorSessions',
    'updateStatus',
    'updateMenteeSession',
  ]),
  updateBatchSessionStatus: state.data.getIn([
    'mentorSessions',
    'updateStatus',
    'updateBatchSession',
  ]),
  updateMentorSessionStatus: state.data.getIn([
    'mentorSessions',
    'updateStatus',
    'updateMentorSession',
  ]),
  sendLinkStatus: state.data.getIn([
    'sendTransactionalMessage', 'fetchStatus', 'root'
  ]),
  sendLinkFailure: state.data.getIn([
    'errors', 'sendTransactionalMessage/fetch'
  ]),
  mentorSessionDeleteStatus: state.data.getIn(['mentorSessions', 'deleteStatus', 'deleteMentorSession']),
  mentorSessionDeleteFailure: state.data.getIn(['errors', 'mentorSessions/delete'])
})


const MentorDashboardSideNavWithExtraProps = injectProps({
  notification
})(MentorDashboardSideNav)
export default connect(mapStateToProps)(withRouter(MentorDashboardSideNavWithExtraProps))
