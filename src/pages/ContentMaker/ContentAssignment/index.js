import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../../components/withNav'
import injectProps from '../../../components/injectProps'
import ContentAssignment from './ContentAssignment'
import { HOMEWORK_ASSIGNMENT } from '../../../constants/CourseComponents'
import { filterKey } from '../../../utils/data-utils'

const ContentAssignmentNav = withNav(ContentAssignment)({
  title: 'Assignments',
  activeNavItem: 'Assignments',
  showContentMakerNavigation: true,
})


const mapStateToProps = state => ({
  assignmentQuestion: filterKey(state.data.getIn(['assignmentQuestion', 'data']), 'assignmentQuestions'),
  assignmentQuestionMeta: state.data.getIn(['assignmentQuestionMeta', 'data', 'count']),
  assignmentQuestionFetchingStatus: state.data.getIn(['assignmentQuestions', 'fetchStatus', 'assignmentQuestions']),
  assignmentQuestionUpdateStatus: state.data.getIn(['assignmentQuestions', 'updateStatus', 'assignmentQuestions']),
  assignmentQuestionUpdateFailure: state.data.getIn(['errors', 'assignmentQuestions/update']),
  assignmentQuestionAddStatus: state.data.getIn(['assignmentQuestions', 'addStatus', 'assignmentQuestions']),
  assignmentQuestionAddFailure: state.data.getIn(['errors', 'assignmentQuestions/add']),
  assignmentQuestionDeleteStatus: state.data.getIn(['assignmentQuestions', 'deleteStatus', 'assignmentQuestions']),
  assignmentQuestionDeleteFailure: state.data.getIn(['errors', 'assignmentQuestions/delete']),

  homeworkFetchStatus: state.data.getIn(['assignmentQuestions', 'fetchStatus', HOMEWORK_ASSIGNMENT]),
  homeworkData: filterKey(state.data.getIn(['assignmentQuestion', 'data']), HOMEWORK_ASSIGNMENT),
  homeworkUpdateStatus: state.data.getIn(['assignmentQuestions', 'updateStatus', HOMEWORK_ASSIGNMENT]),
  homeworkAddStatus: state.data.getIn(['assignmentQuestions', 'addStatus', HOMEWORK_ASSIGNMENT]),

  coursesData: state.data.getIn(['course', 'data']),
  coursesFetchStatus: state.data.getIn(['courses', 'fetchStatus', 'courses']),
})

const ContentAssignmentNavWithExtraProps = injectProps({
  notification,
})(ContentAssignmentNav)

export default connect(mapStateToProps)(withRouter(ContentAssignmentNavWithExtraProps))
