import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import AddChapters from './AddChapters'
import { filterKey } from '../../utils/data-utils'

const AddChaptersNav = withNav(AddChapters)({
  title: 'Add Chapter',
  activeNavItem: 'Add Chapter',
  showCourseMakerNavigation: true,
})

const mapStateToProps = state => ({
  chapterData: filterKey(state.data.getIn(['chapters', 'data']), 'chapters'),
  chaptersMeta: state.data.getIn(['chaptersMeta', 'data', 'count']),
  chapterFetchStatus: state.data.getIn(['chapters', 'fetchStatus', 'chapters']),
  chapterAddStatus: state.data.getIn(['chapters', 'addStatus', 'chapters']),
  chapterAddFailure: state.data.getIn(['errors', 'chapters/add']),
  chapterUpdateStatus: state.data.getIn(['chapters', 'updateStatus', 'chapters']),
  chapterUpdateFailure: state.data.getIn(['errors', 'chapters/update']),
  chapterDeleteStatus: state.data.getIn(['chapters', 'deleteStatus', 'chapters']),
  chapterDeleteFailure: state.data.getIn(['errors', 'chapters/delete']),

  coursesData: state.data.getIn(['course', 'data']),
  coursesFetchStatus: state.data.getIn(['courses', 'fetchStatus', 'courses']),
  topicsData: state.data.getIn(['topic', 'data']),
  topicFetchingStatus: state.data.getIn(['topics', 'fetchStatus']),
})

const AddChaptersNavWithExtraProps = injectProps({
  notification,
})(AddChaptersNav)

export default connect(mapStateToProps)(withRouter(AddChaptersNavWithExtraProps))
