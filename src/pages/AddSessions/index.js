import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import AddSessions from './AddSessions'

const AddSessionsNav = withNav(AddSessions)({
  title: 'Course Maker',
  activeNavItem: 'Add Sessions',
  showCourseMakerNavigation: true,
})

const mapStateToProps = state => ({
  topicsData: state.data.getIn(['topic', 'data']),
  topicsMeta: state.data.getIn(['topicsMeta', 'data', 'count']),
  topicFetchingStatus: state.data.getIn(['topics', 'fetchStatus']),
  topicAddingStatus: state.data.getIn(['topics', 'addStatus']),
  topicAddFailure: state.data.getIn(['errors', 'topics/add']),
  topicUpdateStatus: state.data.getIn(['topics', 'updateStatus']),
  topicUpdateFailure: state.data.getIn(['errors', 'topics/update']),
  topicDeleteStatus: state.data.getIn(['topics', 'deleteStatus', 'topics']),
  topicDeleteFailure: state.data.getIn(['errors', 'topics/delete'])
})

const AddSessionsNavWithExtraProps = injectProps({
  notification,
})(AddSessionsNav)

export default connect(mapStateToProps)(withRouter(AddSessionsNavWithExtraProps))
