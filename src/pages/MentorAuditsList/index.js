import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import MentorAuditList from './MentorAuditList'
import withNav from '../../components/withNav'
import { filterKey } from '../../utils/data-utils'
import injectProps from '../../components/injectProps'

const MentorAuditListNav = withNav(MentorAuditList)({
  title: 'Audit',
  activeNavItem: 'Audit',
  shouldBack: false,
  showUMSNavigation: true
})

const mapStateToProps = state => ({
  sessions: filterKey(
    state.data.getIn([
      'completedSession',
      'data'
    ]), 'mentorAudits'
  ),
  mentorAudits: filterKey(state.data.getIn([
    'mentorAudits',
    'data'
  ]), 'mentorAudits'),
  usersForAudits: state.data.getIn([
    'usersForAudits',
    'data'
  ]),
  usersFetchStatus: state.data.getIn([
    'users',
    'fetchStatus',
    'users'
  ]),
  isAuditUpdating: state.data.getIn([
    'mentorAudits',
    'updateStatus',
    'mentorAudits',
    'loading'
  ]),
  mentorAuditsFetchStatus: state.data.getIn([
    'mentorAudits',
    'fetchStatus'
  ]),
  users: filterKey(
    state.data.getIn([
      'user',
      'data'
    ]), 'mentorAudits'
  ),
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
  updateVideoLinkStatus: state.data.getIn([
    'completedSession',
    'updateStatus',
    'mentorAudits'
  ]),
  totalMentorAudits: state.data.getIn([
    'totalMentorAudits'
  ]),
  mentorMenteeSessionsForAudit: state.data.getIn(['mentorMenteeSessionsForAudit', 'data']),
  mentorMenteeSessionsForAuditFetchStatus: state.data.getIn(['mentorMenteeSessionsForAudit', 'fetchStatus', 'mentorMenteeSessionsForAudit']),
  mentorAuditsFetchingStatus: state.data.getIn(['mentorAudits', 'fetchStatus', 'mentorAudits']),
  auditUpdatingStatus: state.data.getIn(['mentorAudits',
    'updateStatus',
    'mentorAudits']),
  mentorMenteeSessionsMeta: state.data.getIn(['mentorMenteeSessionsMeta', 'data', 'count']),
  sessionCountWithLessThanFiveRating: state.data.getIn(['sessionCountWithLessThanFiveRating', 'data', 'count']),
  sessionCountWith5Rating: state.data.getIn(['sessionCountWith5Rating', 'data', 'count']),
  sessionCountWithLink: state.data.getIn(['sessionCountWithLink', 'data', 'count']),
  sessionCountWithIsAudit: state.data.getIn(['sessionCountWithIsAudit', 'data', 'count']),
  mentorsForAuditsFetchStatus: state.data.getIn(['users', 'fetchStatus', 'mentorsForAudits']),
  mentorsForAudits: filterKey(state.data.getIn(['mentorsForAudits', 'data']), 'mentorsForAudits'),
  mentorMenteeSessionsUpdateStatus: state.data.getIn(['mentorMenteeSessionsForAudit', 'updateStatus', 'mentorMenteeSessionsForAudit'])
})

const MentorAuditsNavWithExtraProps = injectProps({
  notification,
})(MentorAuditListNav)

export default connect(mapStateToProps)(withRouter(MentorAuditsNavWithExtraProps))
