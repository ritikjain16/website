import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../../components/withNav'
import injectProps from '../../../components/injectProps'
import ContentQuiz from './ContentQuiz'
import { QUIZ } from '../../../constants/CourseComponents'
import { filterKey } from '../../../utils/data-utils'

const ContentQuizNav = withNav(ContentQuiz)({
  title: 'Content Quiz',
  activeNavItem: 'Content Quiz',
  showContentMakerNavigation: true,
})

const mapStateToProps = state => ({
  quizData: filterKey(state.data.getIn(['questionBanks', 'data']), `questionBanks/${QUIZ}`),
  quizMetaCount: state.data.getIn(['questionBanksMeta', 'data', 'count']),
  quizFetchingStatus: state.data.getIn(['questionBanks', 'fetchStatus', `questionBanks/${QUIZ}`]),
  quizUpdateStatus: state.data.getIn(['questionBanks', 'updateStatus', `questionBanks/${QUIZ}`]),
  quizUpdateFailure: state.data.getIn(['errors', 'questionBanks/update']),
  quizAddStatus: state.data.getIn(['questionBanks', 'addStatus', `questionBanks/${QUIZ}`]),
  quizAddFailure: state.data.getIn(['errors', 'questionBanks/add']),
  quizDeleteStatus: state.data.getIn(['questionBanks', 'deleteStatus', `questionBanks/${QUIZ}`]),
  quizDeleteFailure: state.data.getIn(['errors', 'questionBanks/delete']),
  quizsUpdateStatus: state.data.getIn(['questionBanks', 'updateStatus', `questionBanksUpdate/${QUIZ}`]),
  quizsUpdateFailure: state.data.getIn(['errors', 'questionBanks/update']),

  coursesData: state.data.getIn(['course', 'data']),
  coursesFetchStatus: state.data.getIn(['courses', 'fetchStatus', 'courses']),

  contentTags: state.data.getIn(['contentTags', 'data']),
  contentTagsFetchStatus: state.data.getIn([
    'contentTags',
    'fetchStatus',
    'contentTags',
  ]),
})

const ContentQuizNavWithExtraProps = injectProps({
  notification,
})(ContentQuizNav)

export default connect(mapStateToProps)(withRouter(ContentQuizNavWithExtraProps))
