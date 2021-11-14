import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import QuestionBank from './QuestionBank'
import withNav from '../../components/withNav'
import { fetchQuestionBank, addQuestionBank, deleteQuestion,
  editQuestionBank, removeMappingWithLo, editQuestions } from '../../actions/questionBank'
import { fetchLearningObjectives } from '../../actions/LearningObjective'
import {
  fetchTopics,
} from '../../actions/episode'
import getTopicTitle from '../../utils/getTopicTitle'

const mapStateToProps = (state, props) => ({
  learningObjectives: state.learningObjectives.learningObjectives,
  questionBanks: state.questionBank,
  topicTitle: getTopicTitle(state, props),
  contentTags: state.data.getIn(['contentTags', 'data']),
  contentTagsFetchStatus: state.data.getIn([
    'contentTags',
    'fetchStatus',
    'contentTags',
  ]),
})

const mapDispatchToProps = dispatch => ({
  fetchLearningObjectives: (id) => dispatch(fetchLearningObjectives(id)),
  fetchTopics: (topicId) => dispatch(fetchTopics(topicId)),
  fetchQuestionBank: (id) => dispatch(fetchQuestionBank(id)),
  addQuestionBank: (input, learningObjectiveId, topicConnectId) =>
    dispatch(addQuestionBank(input, learningObjectiveId, topicConnectId)),
  deleteQuestion: (id) => dispatch(deleteQuestion(id)),
  editQuestionBank: (input, learningObjectiveId, topicConnectId) =>
    dispatch(editQuestionBank(input, learningObjectiveId, topicConnectId)),
  removeMappingWithLo: (input) => removeMappingWithLo(input),
  editQuestions: input => dispatch(editQuestions(input))
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withNav(QuestionBank)(
  { titlePath: 'topicTitle',
    activeNavItem: 'Topics',
    showCMSNavigation: true,
    breadCrumbPath: [{ name: 'Topics', route: '/topics' },
      { path: 'topicTitle', route: '/learning-objectives/' },
      { name: 'Questions', route: '/questionbank/' }] }
)))
