import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { notification } from 'antd'
import Assignment from './Assignment'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import getTopicTitle from '../../utils/getTopicTitle'

const AssignmentNav = withNav(Assignment)({
  title: 'Assignment',
  titlePath: 'topicTitle',
  activeNavItem: 'Topics',
  showCMSNavigation: true,
  breadCrumbPath: [
    { name: 'Topics', route: '/topics' },
    { path: 'topicTitle', route: '/learning-objectives/' },
    { name: 'Assignments', route: '/assignment/' }
  ]
})

// const getTopicTitle = (state) => {
//   const assignments = state.data.getIn([
//     'assignmentQuestion',
//     'data'
//   ])
//   if (assignments.toJS()[0]) {
//     return assignments.toJS()[0].topic.title
//   }

//   return ''
// }

const mapStateToProps = (state, props) => ({
  assignments: state.data.getIn([
    'assignmentQuestion',
    'data'
  ]),
  hasAssignmentFetched: state.data.getIn([
    'assignmentQuestion',
    'fetchStatus',
    'assignmentQuestion',
    'success'
  ]),
  isAssignmentFetching: state.data.getIn([
    'assignmentQuestion',
    'fetchStatus',
    'assignmentQuestion',
    'loading'
  ]),
  hasAssignmentFetchFailed: state.data.getIn([
    'assignmentQuestion',
    'fetchStatus',
    'assignmentQuestion',
    'failure'
  ]),
  isAssignmentAdding: state.data.getIn([
    'assignmentQuestion',
    'addStatus',
    'addAssignmentQuestion',
    'loading'
  ]),
  isAssignmentAdded: state.data.getIn([
    'assignmentQuestion',
    'addStatus',
    'addAssignmentQuestion',
    'success'
  ]),
  hasAssignmentAddFailed: state.data.getIn([
    'assignmentQuestion',
    'addStatus',
    'addAssignmentQuestion',
    'failure'
  ]),
  isAssignmentUpdating: state.data.getIn([
    'assignmentQuestion',
    'updateStatus',
    'updateAssignmentQuestion',
    'loading'
  ]),
  isAssignmentUpdated: state.data.getIn([
    'assignmentQuestion',
    'updateStatus',
    'updateAssignmentQuestion',
    'success'
  ]),
  hasAssignmentUpdateFailed: state.data.getIn([
    'assignmentQuestion',
    'updateStatus',
    'updateAssignmentQuestion',
    'failure'
  ]),
  isAssignmentDeleting: state.data.getIn([
    'assignmentQuestion',
    'deleteStatus',
    'deleteAssignmentQuestion',
    'loading'
  ]),
  isAssignmentDeleted: state.data.getIn([
    'assignmentQuestion',
    'deleteStatus',
    'deleteAssignmentQuestion',
    'success'
  ]),
  hasAssignmentDeleteFailed: state.data.getIn([
    'assignmentQuestion',
    'deleteStatus',
    'deleteAssignmentQuestion',
    'failure'
  ]),
  assignmentErrors: state.data.getIn([
    'errors'
  ]),
  topicTitle: getTopicTitle(state, props),
})

const AssignmentNavWithExtraProps = injectProps({
  notification
})(AssignmentNav)

export default connect(mapStateToProps)(withRouter(AssignmentNavWithExtraProps))
