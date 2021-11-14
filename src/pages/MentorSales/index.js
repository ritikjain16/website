import { Map } from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import MentorSales from './MentorSales'
import withNav from '../../components/withNav'
import { filterKey } from '../../utils/data-utils'
import injectProps from '../../components/injectProps'
import fetchSessionLogsMeta from '../../actions/sessions/fetchSessionLogsMeta'

const MentorSalesNav = withNav(MentorSales)({
  title: 'Mentor Mentee Management',
  activeNavItem: 'Mentor Mentee Management',
  showUMSNavigation: true,
  showCountryDropdown: true,
})

const mapStateToProps = (state) => ({
  sessions: filterKey(
    state.data.getIn(['completedSession', 'data']),
    'completedSession'
  ),
  hasSalesOperationUpdate: state.data.getIn([
    'salesOperation',
    'updateStatus',
    'completedSession',
    'success',
  ]),
  hasSalesOperationAdd: state.data.getIn([
    'salesOperation',
    'addStatus',
    'completedSession',
    'success',
  ]),
  sessionFetchStatus: state.data.getIn(['mentorSales', 'fetchStatus']),
  users: state.data.getIn(['user', 'data']),
  mentors: filterKey(state.data.getIn(['user', 'data']), 'user/mentor'),
  menteeSessions: state.data.getIn(['menteeSession', 'data']),
  addSOStatus: state.data.getIn([
    'salesOperation',
    'addStatus',
    'salesOperationAdd',
  ]),
  updateSOStatus: state.data.getIn([
    'salesOperationForMentorSales',
    'updateStatus',
    'salesOperationForMentorSalesUpdate',
  ]),
  updateVideoLinkStatus: state.data.getIn([
    'completedSession',
    'updateStatus',
    'updateCompletedSession',
  ]),
  countData: state.data.getIn(['countData']),
  totalCompletedSessions: state.data.getIn(['totalCompletedSessions']),
  mentorSales: state.data.getIn(['salesOperationForMentorSales', 'data']),
  addNoteStatus: state.data.getIn([
    'completedSession',
    'updateStatus',
    'completedSession',
  ]),
  unlinkedSalesOperation: state.data.getIn(['unlinkedSalesOperation', 'data']),
  unlinkedSalesOperationFetchStatus: state.data.getIn([
    'unlinkedSalesOperation',
    'fetchStatus',
    'getSalesOperation',
  ]),
  sessionLogs: (state.data.getIn(['sessionLogs', 'data']) || Map({})).toJS(),
  ...fetchSessionLogsMeta().mapStateToProps()

})

const MentorSalesNavWithExtraProps = injectProps({
  notification,
})(MentorSalesNav)

export default connect(mapStateToProps)(
  withRouter(MentorSalesNavWithExtraProps)
)
