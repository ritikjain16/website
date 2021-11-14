import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import CompletedSessions from './CompletedSessions'
import withNav from '../../components/withNav'
import { filterKey } from '../../utils/data-utils'
import injectProps from '../../components/injectProps'

const CompletedSessionsNav = withNav(CompletedSessions)({
  title: 'Mentor Mentee Management',
  activeNavItem: 'Mentor Mentee Management',
  showUMSNavigation: true,
  showCountryDropdown: true,
})

const mapStateToProps = state => ({
  sessions: state.data.getIn([
    'completedSession',
    'data'
  ]),
  sessionFetchStatus: state.data.getIn([
    'completedSession',
    'fetchStatus'
  ]),
  users: filterKey(
    state.data.getIn([
      'user',
      'data'
    ]), 'completedSession'
  ),
  // mentors: state.data.getIn([
  //   'user',
  //   'data'
  // ]),
  mentors: filterKey(
    state.data.getIn([
      'user',
      'data'
    ]), 'user'
  ),
  menteeSessions:
    state.data.getIn([
      'menteeSession',
      'data'
    ]),
  salesOperation: state.data.getIn([
    'salesOperation',
    'data'
  ]),
  addSOStatus: state.data.getIn([
    'salesOperation',
    'addStatus',
    'salesOperationAdd'
  ]),
  updateSOStatus: state.data.getIn([
    'salesOperation',
    'updateStatus',
    'salesOperationUpdate'
  ]),
  updateSessionStatus: state.data.getIn([
    'completedSession',
    'updateStatus',
    'completedSession'
  ]),
  updateVideoLinkStatus: state.data.getIn([
    'completedSession',
    'updateStatus',
    'updateCompletedSession'
  ]),
  countData: state.data.getIn([
    'countData'
  ]),
  totalCompletedSessions: state.data.getIn([
    'totalCompletedSessions'
  ]),
  startingSessionStatus: state.data.getIn([
    'completedSession',
    'updateStatus'
  ]),
  sendLinkStatus: state.data.getIn([
    'sendTransactionalMessage', 'fetchStatus', 'root'
  ]),
  sendLinkFailure: state.data.getIn([
    'errors', 'sendTransactionalMessage/fetch'
  ]),
  sessionLogs: state.data.getIn(['sessionLogs', 'data'])
})

const CompletedSessionsNavWithExtraProps = injectProps({
  notification
})(CompletedSessionsNav)

export default connect(mapStateToProps)(withRouter(CompletedSessionsNavWithExtraProps))
