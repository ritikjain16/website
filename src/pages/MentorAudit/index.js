import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import MentorAudit from './MentorAudit'

const MentorAuditNav = withNav(MentorAudit)({
  title: 'Audit',
  activeNavItem: 'Audit',
  backRoute: '/audit',
  shouldBack: true,
  showUMSNavigation: true,
})

const mapStateToProps = state => ({
  mentorMenteeSessionAudit: state.data.getIn([
    'mentorMenteeSessionAudit',
    'data'
  ]),
  isMentorMenteeSessionAuditUpdating: state.data.getIn([
    'mentorMenteeSessionAudit',
    'updateStatus',
    'mentorMenteeSessionAudit',
    'loading',
  ]),
  isMentorMenteeSessionAuditUpdateSuccess: state.data.getIn([
    'mentorMenteeSessionAudit',
    'updateStatus',
    'mentorMenteeSessionAudit',
    'success',
  ]),
  isMentorMenteeSessionAuditFetching: state.data.getIn([
    'mentorMenteeSessionAudit',
    'fetchStatus',
    'mentorMenteeSessionAudit',
    'loading',
  ]),
  isMentorMenteeSessionTimestampCreating: state.data.getIn([
    'mentorMenteeSessionTimestamp',
    'addStatus',
    'mentorMenteeSessionTimestamp',
    'loading',
  ]),
  isMentorMenteeSessionTimestampSuccess: state.data.getIn([
    'mentorMenteeSessionTimestamp',
    'addStatus',
    'mentorMenteeSessionTimestamp',
    'success',
  ]),
  addMentorMenteeSessionTimestamp: state.data.getIn([
    'mentorMenteeSessionTimestamp',
    'data',
  ]),
  isMentorMenteeSessionTimestampDeleting: state.data.getIn([
    'mentorMenteeSessionTimestamp',
    'deleteStatus',
    'mentorMenteeSessionTimestamp',
    'loading',
  ]),
  isMentorMenteeSessionTimestampUpdating: state.data.getIn([
    'mentorMenteeSessionTimestamp',
    'updateStatus',
    'mentorMenteeSessionTimestamp',
    'loading',
  ]),
  preSalesAudit: state.data.getIn([
    'preSalesAudit', 'data'
  ]),
  preSalesAuditFetchStatus: state.data.getIn(['preSalesAudit', 'fetchStatus', 'preSalesAudit']),
  preSalesAuditUpdateStatus: state.data.getIn(['preSalesAudit', 'updateStatus']),
  postSalesAudit: state.data.getIn(['postSalesAudit', 'data']),
  postSalesAuditFetchStatus: state.data.getIn(['postSalesAudit', 'fetchStatus', 'postSalesAudit']),
  postSalesAuditUpdateStatus: state.data.getIn(['postSalesAudit', 'updateStatus']),
  mentorMenteeSessionAuditUpdating: state.data.getIn([
    'mentorAudits', 'updateStatus'
  ]),
})

const MentorAuditNavWithExtraProps = injectProps({
  notification,
})(MentorAuditNav)

export default connect(mapStateToProps)(withRouter(MentorAuditNavWithExtraProps))
