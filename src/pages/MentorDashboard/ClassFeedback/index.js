import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import { filterKey } from 'duck-state/lib/State'
import ClassFeedback from './ClassFeedback'
import withMentorDashboardNav from '../../../components/withUpdatedNav'
import injectProps from '../../../components/injectProps'

const ClassFeedbackSideNav = withMentorDashboardNav(ClassFeedback)({
  title: 'Class Feedback',
  activeNavItem: 'Calendar',
})

const mapStateToProps = state => ({
  mentorMenteeSession: state.data.getIn([
    'mentorMenteeSession',
    'data'
  ]),
  updateSessionStatus: state.data.getIn([
    'mentorSessions',
    'updateStatus',
    'updateMentorMenteeSession',
  ]),
  prevMentorSession: filterKey(
    state.data.getIn([
      'mentorSessions',
      'data'
    ]), 'prevMentorSession'
  ),
  salesOperation: filterKey(
    state.data.getIn([
      'salesOperation',
      'data'
    ]), 'salesOperations'
  ),
  isPrevMentorSessionsLoading: state.data.getIn([
    'mentorSessions',
    'fetchStatus',
    'prevMentorSession',
    'loading'
  ]),
  updateMenteeStatus: state.data.getIn([
    'mentorSessions',
    'updateStatus',
    'updateMenteeSession',
  ]),
  mentorSessionsUpdateFailure: state.data.getIn(['errors', 'mentorSessions/update']),
})


const ClassFeedbackSideNavWithExtraProps = injectProps({
  notification
})(ClassFeedbackSideNav)
export default connect(mapStateToProps)(withRouter(ClassFeedbackSideNavWithExtraProps))
