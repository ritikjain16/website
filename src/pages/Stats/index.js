import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Stats from './Stats'
import withNav from '../../components/withNav'
import { filterKey } from '../../utils/data-utils'

const StatsNav = withNav(Stats)({
  title: 'Statistics',
  activeNavItem: 'Stats',
  showUMSNavigation: true,
  showCountryDropdown: true
})

const mapStateToProps = (state) => ({
  fetchStatus: state.data.getIn(['fetchStats', 'fetchStatus', 'fetchStats']),
  totalRegisteredUsers: state.data.getIn(['userMeta', 'data', 'count']),
  unVerifiedUsers: state.data.getIn(['unVerifiedUsers', 'data', 'count']),
  verifiedUsers: state.data.getIn(['verifiedUsers', 'data', 'count']),
  totalBookedSessionsBetween: state.data.getIn(['menteeSessionsMeta', 'data', 'count']),
  futureBookedSessions: state.data.getIn(['futureMenteeSessionsMeta', 'data', 'count']),
  todaysBookedSessions: filterKey(state.data.getIn(['menteeSession', 'data']), 'fetchStats'),
  paidUsers: state.data.getIn(['convertedUsers', 'data', 'count']),
  salesOperationReport: state.data.getIn(['salesOperationReport', 'data']),
  bookedSessionsCount: state.data.getIn(['bookedSessionsCount', 'data', 'count']),
  allottedSessionsCount: state.data.getIn(['allottedSessionsCount', 'data', 'count']),
  startedSessionsCount: state.data.getIn(['startedSessionsCount', 'data', 'count']),
  completedSessionsCount: state.data.getIn(['completedSessionsCount', 'data', 'count']),
  missedSessionsCount: state.data.getIn(['missedSessionsCount', 'data', 'count']),
  sessionReportsFetchStatus: state.data.getIn(['sessionReports', 'fetchStatus']),
  sessionReports: state.data.getIn(['sessionReports', 'data'])
})

export default connect(mapStateToProps)(withRouter(StatsNav))
