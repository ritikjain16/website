import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { get, sortBy } from 'lodash'
import { notification } from 'antd'
import withNav from '../../../components/withNav'
import injectProps from '../../../components/injectProps'
import ContentQuestions from './ContentQuestions'
import { CONTENT_MAKER } from '../../../constants/roles'
import { filterKey } from '../../../utils/data-utils'
import { PRACTICE_QUESTION } from '../../../constants/CourseComponents'


const ContentQuestionsNav = withNav(ContentQuestions)({
  title: 'Questions',
  activeNavItem: 'Learning Objective',
  titlePath: 'topicTitle',
  showContentMakerNavigation: true,
  blockType: CONTENT_MAKER,
  breadCrumbPath: [{ name: 'Learning Objective', route: '/content-learningObjective' },
    { path: 'topicTitle', route: '/content-learningObjective' }, { name: 'Questions', route: '/content-questions/' }]
})

const setLearningObjectives = (state, props) =>
  sortBy(state.data.getIn(['learningObjectives', 'data']).toJS(), 'order').find(learningObjective => learningObjective.id === props.match.params.learningObjectiveId)

const mapStateToProps = (state, props) => ({
  topicTitle: setLearningObjectives(state, props) ? get(setLearningObjectives(state, props), 'title') : '',
  questionBanks: filterKey(state.data.getIn(['questionBanks', 'data']), `questionBanks/${PRACTICE_QUESTION}`),
  questionsFetchingStatus: state.data.getIn(['questionBanks', 'fetchStatus', `questionBanks/${PRACTICE_QUESTION}`]),
  questionUpdateStatus: state.data.getIn(['questionBanks', 'updateStatus', `questionBanks/${PRACTICE_QUESTION}`]),
  questionUpdateFailure: state.data.getIn(['errors', 'questionBanks/update']),
  questionAddStatus: state.data.getIn(['questionBanks', 'addStatus', `questionBanks/${PRACTICE_QUESTION}`]),
  questionAddFailure: state.data.getIn(['errors', 'questionBanks/add']),
  questionDeleteStatus: state.data.getIn(['questionBanks', 'deleteStatus', `questionBanks/${PRACTICE_QUESTION}`]),
  questionDeleteFailure: state.data.getIn(['errors', 'questionBanks/delete']),
  questionsUpdateStatus: state.data.getIn(['questionBanks', 'updateStatus', `questionBanksUpdate/${PRACTICE_QUESTION}`]),
  questionsUpdateFailure: state.data.getIn(['errors', 'questionBanks/update']),
  questionBanksMeta: state.data.getIn(['questionBanksMeta', 'data', 'count']),

  contentTags: state.data.getIn(['contentTags', 'data']),
  contentTagsFetchStatus: state.data.getIn([
    'contentTags',
    'fetchStatus',
    'contentTags',
  ]),
})

const ContentQuestionsNavWithExtraProps = injectProps({
  notification,
})(ContentQuestionsNav)

export default connect(mapStateToProps)(withRouter(ContentQuestionsNavWithExtraProps))
