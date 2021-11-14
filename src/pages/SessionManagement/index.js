import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import injectProps from '../../components/injectProps'
import SessionManagement from './SessionManagement'
import withNav from '../../components/withNav'
import { filterKey } from '../../utils/data-utils'

const SessionManagementNav = withNav(SessionManagement)({
  title: 'Sessions',
  activeNavItem: 'Sessions',
  showUMSNavigation: true,
})

const mapStateToProps = state => ({
  sessions: state.data.getIn([
    'session',
    'data'
  ]),
  addedSession: filterKey(
    state.data.getIn([
      'session',
      'data'
    ]), 'session'
  ),
  sessionFetchStatus: state.data.getIn([
    'session',
    'fetchStatus'
  ]),
  mentors: filterKey(
    state.data.getIn([
      'user',
      'data'
    ]), 'user'
  ),
  sessionAddStatus: state.data.getIn([
    'session',
    'addStatus'
  ]),
  sessionUpdateStatus: state.data.getIn([
    'session',
    'updateStatus'
  ]),
  sessionDeleteStatus: state.data.getIn([
    'session',
    'deleteStatus'
  ]),
  courses: state.data.getIn([
    'course',
    'data'
  ]).toJS(),
  addError: state.data.getIn([
    'errors',
    'session/add'
  ]),
  updateError: state.data.getIn(['errors', 'session/update']),
  deleteError: state.data.getIn(['errors', 'session/delete']),
  mentorSessionsMeta: state.data.getIn([
    'mentorSessionsMeta',
    'data'
  ])
})

const SessionManagementWithExtraProps = injectProps({
  notification
})(SessionManagementNav)

export default connect(mapStateToProps)(withRouter(SessionManagementWithExtraProps))
