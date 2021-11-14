import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import SlotsInfo from './SlotsInfo'
import injectProps from '../../components/injectProps'
// import { filterKey } from '../../utils/data-utils'

const SlotsInfoWithNav = withNav(SlotsInfo)({
  title: 'Slots Info',
  activeNavItem: 'Slots Info',
  showUMSNavigation: true,
  showCountryDropdown: true,
})

const mapStateToProps = state => ({
  menteeSessions: state.data.getIn([
    'menteeSession',
    'data'
  ]),
  mentorSessions: state.data.getIn([
    'session',
    'data'
  ]),
  availableSlots: state.data.getIn([
    'availableSlot',
    'data'
  ]),
  fetchStatus: state.data.getIn([
    'session',
    'fetchStatus'
  ]),
  users: state.data.getIn([
    'user',
    'data'
  ]),
  slotsInfoFetchStatus: state.data.getIn([
    'slotsInfo',
    'fetchStatus',
    'slotsInfo'
  ]),
  salesOperationReport: state.data.getIn([
    'salesOperationReport',
    'data'
  ]),
  mentorSessionStatus: state.data.getIn([
    'mentorSession',
    'fetchStatus'
  ]),
  mentorMenteeSessions: state.data.getIn([
    'completedSession',
    'data'
  ]),
  mentorMenteeSessionAddStatus: state.data.getIn([
    'mentorMenteeSession',
    'addStatus'
  ]),
  mentorMenteeSessionDeleteStatus: state.data.getIn([
    'mentorMenteeSession',
    'deleteStatus'
  ]),
  allottedSessions: state.data.getIn([
    'completedSession',
    'data'
  ]),
  courses: state.data.getIn(['course', 'data']),
  courseFetchingStatus: state.data.getIn(['course', 'fetchStatus', 'course']),
  sessionLogs: state.data.getIn(['sessionLogs', 'data'])
})

const SlotsInfoWithExtraProps = injectProps({
  notification
})(SlotsInfoWithNav)

export default connect(mapStateToProps)(withRouter(SlotsInfoWithExtraProps))
