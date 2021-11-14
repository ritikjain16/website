import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../../components/withNav'
import injectProps from '../../../components/injectProps'
import ContentLearningObjective from './ContentLearningObjective'
import { CONTENT_MAKER } from '../../../constants/roles'

const ContentLearningObjectiveNav = withNav(ContentLearningObjective)({
  title: 'Learning Objective',
  activeNavItem: 'Learning Objective',
  titlePath: 'topicTitle',
  showContentMakerNavigation: true,
  blockType: CONTENT_MAKER,
  breadCrumbPath: [{ name: 'Learning Objective', route: '/content-learningObjective' }]
})

const mapStateToProps = state => ({
  learningObectiveFetchingStatus: state.data.getIn(['learningObjectives', 'fetchStatus', 'learningObjectives']),
  learningObjectiveData: state.data.getIn(['learningObjectives', 'data']),
  learningObjectivesMeta: state.data.getIn(['learningObjectivesMeta', 'data', 'count']),
  learningObectiveDeleteStatus: state.data.getIn(['learningObjectives', 'deleteStatus', 'learningObjectives']),
  learningObectiveDeleteFailure: state.data.getIn(['errors', 'learningObjectives/delete']),
  learningObectiveUpdateStatus: state.data.getIn(['learningObjectives', 'updateStatus', 'learningObjectives']),
  learningObjectiveUpdateFailure: state.data.getIn(['errors', 'learningObjectives/update']),
  learningObectiveAddStatus: state.data.getIn(['learningObjectives', 'addStatus', 'learningObjectives']),
  learningObectiveAddFailure: state.data.getIn(['errors', 'learningObjectives/add']),

  coursesData: state.data.getIn(['course', 'data']),
  coursesFetchStatus: state.data.getIn(['courses', 'fetchStatus', 'courses']),
})

const ContentLearningObjectiveNavWithExtraProps = injectProps({
  notification,
})(ContentLearningObjectiveNav)

export default connect(mapStateToProps)(withRouter(ContentLearningObjectiveNavWithExtraProps))
