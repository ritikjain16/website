import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import QuestionsTable from './QuestionsTable'
import toastrMessage from '../../utils/messages'
import { UNPUBLISHED_STATUS, PUBLISHED_STATUS } from '../../constants/questionBank'
import { getDataByProp } from '../../utils/data-utils'
import { fetchContentTags } from '../../actions/contentTags'

export default class QuestionBank extends React.Component {
  componentDidMount() {
    const topicId = this.props.match.params.id
    const { learningObjectives, questionBanks: { questionBanks } } = this.props
    const filteredLearningObjectivesByTopic = getDataByProp(learningObjectives, 'topic.id', topicId)
    const filteredQuestionsByTopic = getDataByProp(questionBanks, 'topic.id', topicId)
    if (filteredLearningObjectivesByTopic.length < 1) {
      this.props.fetchLearningObjectives(topicId)
    }
    if (filteredQuestionsByTopic.length < 1) {
      this.props.fetchQuestionBank(topicId)
      this.props.fetchTopics(topicId)
    }
    fetchContentTags(`{ and: [
        {status:published}
      ]
    }`, 0, 0)
  }
  componentDidUpdate(prevprops) {
    const { isAddingQuestionbank, isEditingQuestionbank, isDeletingQuestionbank,
      fetchingQuestionbankError, addingQuestionbankError, hasDeletedQuestionbank,
      deletingQuestionbankError, editingQuestionbankError,
      hasAddedQuestionbank, hasEditedQuestionbank
    } = this.props.questionBanks
    toastrMessage(fetchingQuestionbankError, prevprops.questionBanks.fetchingQuestionbankError, 'error', fetchingQuestionbankError)
    /* Adding notifications */
    if (isAddingQuestionbank) {
      toastrMessage(isAddingQuestionbank, prevprops.isAddingQuestionbank, 'loading', 'Adding Question')
    }
    if (!prevprops.hasAddedQuestionbank && hasAddedQuestionbank) {
      toastrMessage(hasAddedQuestionbank, prevprops.questionBanks.hasAddedQuestionbank, 'success', 'Added Question')
    }
    toastrMessage(addingQuestionbankError, prevprops.questionBanks.addingQuestionbankError, 'error', addingQuestionbankError)
    /* Editing notifications */
    if (isEditingQuestionbank && !prevprops.questionBanks.isEditingQuestionbank) {
      toastrMessage(isEditingQuestionbank, prevprops.questionBanks.isEditingQuestionbank, 'loading', 'Updating Question')
    }
    if (hasEditedQuestionbank && !prevprops.questionBanks.hasEditedQuestionbank) {
      toastrMessage(hasEditedQuestionbank, prevprops.questionBanks.hasEditedQuestionbank, 'success', 'Updated Question')
    }
    toastrMessage(editingQuestionbankError, prevprops.questionBanks.editingQuestionbankError, 'error', editingQuestionbankError)
    /* Deleting notifications */
    if (isDeletingQuestionbank) {
      toastrMessage(isDeletingQuestionbank, prevprops.questionBanks.isDeletingQuestionbank, 'loading', 'Deleting Question')
    }
    if (hasDeletedQuestionbank && !prevprops.questionBanks.hasDeletedQuestionbank) {
      toastrMessage(hasDeletedQuestionbank, prevprops.questionBanks.hasDeletedQuestionbank, 'success', 'Deleted Questionbank')
    }
    toastrMessage(deletingQuestionbankError, prevprops.questionBanks.deletingQuestionbankError, 'error', deletingQuestionbankError)
  }
  deleteQuestion=(id) => () => {
    const { deleteQuestion } = this.props
    deleteQuestion(id)
  }
  publish=(id) => () => {
    const { editQuestionBank } = this.props
    const input = {
      id,
      status: PUBLISHED_STATUS
    }
    editQuestionBank(input)
  }
  unpublish=(id) => () => {
    const { editQuestionBank } = this.props
    const input = {
      id,
      status: UNPUBLISHED_STATUS
    }
    editQuestionBank(input)
  }
  getLearningObjectives = (learningObjectives, topicId) =>
    learningObjectives.filter(lo => get(lo, 'topics', []).map(topic => get(topic, 'id')).includes(topicId))

  getQuestionsForTopic = (questionBanks, topicId) => {
    /** as topic and LO became topics and LO`s so we have to get only those questions with
    the currect topic so this filters are applied.
    but this will not be applicable for the newly added question from CMS
    as we have to pass topicConnectIds: [], and same for LO instead of single
    topicConnectId, may be changed later */
    let questions = questionBanks.filter(question => get(question, 'topics', []).map(topic => get(topic, 'id')).includes(topicId))
    questions = questions.map(question => ({ ...question, learningObjective: get(question, 'learningObjectives[0]') }))
    return questions
  }

  render() {
    const { learningObjectives, contentTagsFetchStatus, contentTags,
      questionBanks: { questionBanks, isFetchingQuestionbank }, topicTitle } = this.props
    const topicId = this.props.match.params.id
    return (
      <QuestionsTable
        learningObjectives={this.getLearningObjectives(learningObjectives, topicId)}
        topicConnectId={topicId}
        topicTitle={topicTitle}
        addQuestionBank={this.props.addQuestionBank}
        editQuestionBank={this.props.editQuestionBank}
        editQuestions={this.props.editQuestions}
        deleteQuestion={this.deleteQuestion}
        publishQuestion={this.publish}
        unpublishQuestion={this.unpublish}
        removeMappingWithLo={this.props.removeMappingWithLo}
        questionBanks={this.getQuestionsForTopic(questionBanks, topicId)}
        isFetchingQuestionbank={isFetchingQuestionbank}
        contentTagsFetchStatus={contentTagsFetchStatus}
        contentTags={contentTags}
      />
    )
  }
}
QuestionBank.propTypes = {
  fetchQuestionBank: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  topicTitle: PropTypes.string.isRequired,
  learningObjectives: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchLearningObjectives: PropTypes.func.isRequired,
  fetchTopics: PropTypes.func.isRequired,
  addQuestionBank: PropTypes.func.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
  editQuestionBank: PropTypes.func.isRequired,
  editQuestions: PropTypes.func.isRequired,
  removeMappingWithLo: PropTypes.func.isRequired,
  questionBanks: PropTypes.shape({
    questionBanks: PropTypes.arrayOf(PropTypes.shape({})),
    fetchingQuestionbankError: PropTypes.string,
    addingQuestionbankError: PropTypes.string,
    deletingQuestionbankError: PropTypes.string,
    editingQuestionbankError: PropTypes.string,
    isAddingQuestionbank: PropTypes.bool,
    isEditingQuestionbank: PropTypes.bool,
    hasAddedQuestionbank: PropTypes.bool.isRequired,
    hasEditedQuestionbank: PropTypes.bool,
    isDeletingQuestionbank: PropTypes.bool,
    hasDeletedQuestionbank: PropTypes.bool
  }).isRequired
}
