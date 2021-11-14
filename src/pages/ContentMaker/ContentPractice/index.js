import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../../components/withNav'
import injectProps from '../../../components/injectProps'
import ContentPractice from './ContentPractice'
import { filterKey } from '../../../utils/data-utils'

const ContentPracticeNav = withNav(ContentPractice)({
  title: 'Block based Practice',
  activeNavItem: 'Block based Practice',
  showContentMakerNavigation: true,
})

const mapStateToProps = state => ({
  blockBasedPracticeMeta: state.data.getIn(['blockBasedProjectsMeta', 'data', 'count']),
  practiceFetchingStatus: state.data.getIn(['blockBasedProjects', 'fetchStatus', 'practice']),
  practiceData: filterKey(state.data.getIn(['blockBasedProjects', 'data']), 'practice'),
  practiceAddStatus: state.data.getIn(['blockBasedProjects', 'addStatus', 'practice']),
  practiceAddFailure: state.data.getIn(['errors', 'blockBasedProjects/add']),
  practiceUpdateStatus: state.data.getIn(['blockBasedProjects', 'updateStatus', 'practice']),
  practiceUpdateFailure: state.data.getIn(['errors', 'blockBasedProjects/update']),
  practiceDeleteStatus: state.data.getIn(['blockBasedProjects', 'deleteStatus', 'practice']),
  practiceDeleteFailure: state.data.getIn(['errors', 'blockBasedProjects/delete']),

  coursesData: state.data.getIn(['course', 'data']),
  coursesFetchStatus: state.data.getIn(['courses', 'fetchStatus', 'courses']),
})

const ContentPracticeNavWithExtraProps = injectProps({
  notification,
})(ContentPracticeNav)

export default connect(mapStateToProps)(withRouter(ContentPracticeNavWithExtraProps))
